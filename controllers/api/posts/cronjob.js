const cron = require("node-cron");
const mongoose = require("mongoose");
const {
  successJSONResponse,
  failureJSONResponse,
  ModelNameByAdsType,
} = require(`../../../handlers/jsonResponseHandlers`);

cron.schedule("*/15 * * * *", async () => {
  try {
    const adTypes = [
      { key: "job", label: "Jobs" },
      { key: "event", label: "Events" },
      { key: "Buy & Sell", label: "Buy & Sell" },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" },
      { key: "Local_biz & Service", label: "Local Biz & Services" },
      { key: "rental", label: "Rentals" },
    ];

    for (const adType of adTypes) {
      const Model = mongoose.model(adType.key);

      // Find documents that meet the criteria
      let documents;
      if(adType.key == "event"){
         documents = await Model.find({$and:[
          { "adsInfo.date_time.end_date": { $lt: new Date().toISOString }},
          { status: "active"},
         ]
         });
      }else{
         documents = await Model.find({$and:[
          { "plan_validity.expired_on": { $lt: new Date().toISOString }},
          { status: "active"},
         ]
         });
      }
     

      for (const document of documents) {
        // console.log(document);
        // Parse the string to a Date object
        let expiredOnDate
        let adjustedTime
        if(adType.key == "event"){
          adjustedTime = new Date()
        }else{
          expiredOnDate = new Date(document.plan_validity.expired_on);
          const documentTimezoneOffset = expiredOnDate.getTimezoneOffset();
        // console.log(documentTimezoneOffset);
        // Calculate the adjustclged time using the document's timezone offset
         adjustedTime = new Date(new Date().getTime() + documentTimezoneOffset * 60000);
        }

        // Get the timezone offset from the document's "plan_validity.expired_on" field
        // const documentTimezoneOffset = expiredOnDate.getTimezoneOffset();
        // // console.log(documentTimezoneOffset);
        // // Calculate the adjustclged time using the document's timezone offset
        //  adjustedTime = new Date(new Date().getTime() + documentTimezoneOffset * 60000);
        // console.log(adjustedTime.toISOString(),"rv drvffbdfbfrbd");
        // Update the documents based on the adjusted time
        const result = await Model.updateMany(
          {
            $and: [
              { "plan_validity.expired_on": { $lt: adjustedTime.toISOString() } },
              { status: "active" },
            ],
          },
          {
            $set: { status: 'inactive' },
          }
        ).exec();

        // console.log(`Updated documents in ${adType.key}:`, result);
      }
    }

    console.log("Cron job executed successfully");
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

cron.schedule('0 7 * * *', async (req,res) => {
   
 
        try {
          let datas
            const currentDate = new Date();
            // Convert the date to ISO 8601 format
            const currentISODate = currentDate.toISOString();
          var dbQuery = {
            $and: [
              { status: "active" },
              { "plan_validity.expired_on": { $gte: currentISODate } },
              {"addons_validity.name": "Bump up"}
            ]
          };
          
          let adTypes = [
            { key: "job", label: "Jobs"},
            { key: "event", label: "Events"},
            { key: "Buy & Sell", label: "Buy & Sell"},
            { key: "babysitter & nannie", label: "Babysitters & Nannies" },
            { key: "Local_biz & Service", label: "Local Biz & Services"},
            { key: "rental", label: "Rentals"},
          ];
          let results = [];
          let adTypeCount;
          for (const adType of adTypes) {
           
            let YourModel = mongoose.model(adType.key);
            let checkAlreadyExist = await YourModel.find(dbQuery).exec();
      
           
            let bumpUpDates = checkAlreadyExist.map((data) => {
              // Filter addons_validity to get only the "Bump up" addon
              let bumpUpAddon = data.addons_validity.find(
                (addon) => addon.name === "Bump up"
              );
              if (bumpUpAddon) {
                return {
                  active_on: bumpUpAddon.active_on,
                  expired_on: bumpUpAddon.expired_on,
                  interval: bumpUpAddon.days, // Add the interval property
                };
              }
              return null; // If "Bump up" addon is not found, return null
            }).filter((dates) => dates !== null);
      
            const resultDates = [];
      
            for (const dateRange of bumpUpDates) {
              const { active_on, expired_on, interval } = dateRange;
              const startDate = new Date(active_on);
              const endDate = new Date(expired_on);
              const recordDates = []; // Create a separate array for each record
      
              while (startDate <= endDate) {
                recordDates.push(startDate.toISOString().split("T")[0]);
                startDate.setDate(startDate.getDate() + interval);
              }
      
              resultDates.push(recordDates); // Push the record's dates array into the result array
            }
      
            const today = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"
            let date_of_time = new Date().toISOString()
            // Filter adonsData to find records where resultDates array contains today's date
            const recordsWithTodayDate = checkAlreadyExist.filter((data, index) => {
              const recordDates = resultDates[index]; // Get the resultDates array for the current record
              return recordDates.includes(today);
            });
            let bumpId = recordsWithTodayDate.map(featuredItem => featuredItem._id)
            // console.log(bumpId);
            if(bumpId.length > 0){
               datas =  await YourModel.updateMany(
                { $and: [
                  { _id: { $in: bumpId } },
                  {
                    $or: [
                      { active_on_bumpup_at: { $lt: today } },
                      { active_on_bumpup_at: null }, // Add condition for active_on_bumpup_at < todayDate7am
                    ],
                  }, // Add condition for active_on_bumpup_at < todayDate7am
                ]}, // Find documents with IDs in the array
                { $set: {active_on_bumpup_at:date_of_time} })
            }
          
          
        }
      
          return successJSONResponse(res, { message: `success`,
          total: datas });
        } catch (error) {
          console.log(error);
          return failureJSONResponse(res, { message: `Something went wrong` });
        }
      
  });


