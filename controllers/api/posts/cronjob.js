const cron = require("node-cron");
const mongoose = require("mongoose");
const {
  successJSONResponse,
  failureJSONResponse,
  ModelNameByAdsType,
} = require(`../../../handlers/jsonResponseHandlers`);

cron.schedule("*/15 * * * *", async () => {
  try {
    function formatDate(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
    
      return `${month}/${day}/${year}`;
    }
    const currentDate = new Date();
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        const formattedDate = formatDate(nextDay);
        console.log(formattedDate);
        const formattedDateObjectt = new Date(formattedDate);
        const formattedDateObject = formattedDateObjectt.toISOString();

console.log(formattedDateObject);

        // console.log(formattedDateString.toISOString,"fb fhbfhv");
        // console.log("Formatted Date Object:", formattedDateObject);
// console.log(currentDate,"jmiidid",formattedDate);
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
      let addonsValidity; 
      if (adType.key == "event") {
        
        documents = await Model.find(
          { status: "active" },
       );
       documents = documents.map(record => record.toObject({ virtuals: true }));
       documents = documents.filter(doc => {
     
        // const expiredDate = new Date(doc.expiredAt);
        
        return doc.expiredAt < formattedDateObject;
      });
      } else {
       
        documents = await Model.find({
          $and: [
            { "plan_validity.expired_on": { $lt: new Date().toISOString } },
            { status: "active" },
          ],
        });
        let data = formattedDateObject
        addonsValidity = documents.map(document => {
          return {
              ...document,
              addons_validity: document.addons_validity.map(addon => {
                  return {
                      ...addon,
                      expired_on: formattedDateObject.slice(0, 10),
                  };
              }),
          };
      });
      }

      for (const document of documents) {
       
        // Parse the string to a Date object
        let expiredOnDate;
        let adjustedTime;
        if (adType.key == "event") {
       
          const currentDate = new Date();
        const nextDay = new Date(currentDate);
        // nextDay.setDate(currentDate.getDate() + 1);
        const formattedDate = formatDate(nextDay);
        let data = await Model.find(
          {
            status: "active",
          });
      data = data.map(record => record.toObject({ virtuals: true }));
      data = data.filter(doc => {
       // const expiredDate = new Date(doc.expiredAt);
       return doc.expiredAt < formattedDateObject;
     });
     console.log("object",formattedDateObject);
        
        // Update each document
        for (const document of data) {
          // Update the document
          const addonsValidity = document.addons_validity.map(addon => {
            return {
                ...addon,
                expired_on: formattedDateObject.slice(0, 10),
            };
        });
          // console.log("object",formattedDateObject);
          await Model.updateOne(
            {
              _id: document._id, // or use your unique identifier
            },
            {
              $set: {
                status: "inactive",
                "plan_validity.expired_on": formattedDateObject,
                addons_validity: addonsValidity,
              },
            }
          );
        }
        } else {
          
          expiredOnDate = new Date(document.plan_validity.expired_on);
          const documentTimezoneOffset = expiredOnDate.getTimezoneOffset();
          // console.log(documentTimezoneOffset);
          // Calculate the adjustclged time using the document's timezone offset
          adjustedTime = new Date(
            new Date().getTime() + documentTimezoneOffset * 60000
          );
          const result = await Model.updateMany(
            {
              $and: [
                {
                  "plan_validity.expired_on": {
                    $lt: adjustedTime.toISOString(),
                  },
                },
                { status: "active" },
              ],
            },
            {
              $set: { status: "inactive" ,},
              "plan_validity.expired_on": formattedDateObject,
              addons_validity: addonsValidity[0].addons_validity,
              // Use the same addonsValidity for all documents
            }
          ).exec();
        }

        // Get the timezone offset from the document's "plan_validity.expired_on" field
        // const documentTimezoneOffset = expiredOnDate.getTimezoneOffset();
        // // console.log(documentTimezoneOffset);
        // // Calculate the adjustclged time using the document's timezone offset
        //  adjustedTime = new Date(new Date().getTime() + documentTimezoneOffset * 60000);
        // console.log(adjustedTime.toISOString(),"rv drvffbdfbfrbd");
        // Update the documents based on the adjusted time
        // const result = await Model.updateMany(
        //   {
        //     $and: [
        //       { "plan_validity.expired_on": { $lt: adjustedTime.toISOString() } },
        //       { status: "active" },
        //     ],
        //   },
        //   {
        //     $set: { status: 'inactive' },
        //   }
        // ).exec();

        // console.log(`Updated documents in ${adType.key}:`, result);
      }
    }

    console.log("Cron job executed successfully");
  } catch (error) {
    console.error("Cron job error:", error);
  }
});


cron.schedule("*/1 * * * *", async () => {



  try {
    const currentDate = new Date();
    const currentISODate = currentDate.toISOString();
    console.log(currentISODate, 'Cron job start');

    const adTypes = [
      { key: "job", label: "Jobs" },
      { key: "event", label: "Events" },
      { key: "Buy & Sell", label: "Buy & Sell" },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" },
      { key: "Local_biz & Service", label: "Local Biz & Services" },
      { key: "rental", label: "Rentals" },
    ];

    let datas = [];

    for (const adType of adTypes) {
      const YourModel = mongoose.model(adType.key);
      const checkAlreadyExist = await YourModel.find({
        $and: [
          { status: "active" },
          { "plan_validity.expired_on": { $gte: currentISODate } },
          { "addons_validity.name": "Bump up" },
        ],
      }).exec();

      const bumpUpDates = checkAlreadyExist
        .map((data) => {
          const bumpUpAddon = data.addons_validity.find(
            (addon) => addon.name === "Bump up"
          );

          const currentTimeInTimeZone = new Date().toLocaleString('en-US', { timeZone: data?.location_timezone });
          const currentHour = new Date(currentTimeInTimeZone).getHours();
//hello
          if (currentHour === 7 && bumpUpAddon) {
            const iter = bumpUpAddon.days == 30 ? 1 : bumpUpAddon.days;
            return {
              id: data._id,
              active_on: bumpUpAddon.active_on,
              expired_on: bumpUpAddon.expired_on,
              interval: iter,
              location_timezone: data.location_timezone,
            };
          }
          return null;
        })
        .filter((dates) => dates !== null);

      for (const dateRange of bumpUpDates) {
        const { id, active_on, expired_on, interval, location_timezone } = dateRange;

        const startDate = new Date(active_on);
        const endDate = new Date(expired_on);
        const recordDates = [];

        while (startDate <= endDate) {
          recordDates.push(startDate.toISOString().split("T")[0]);
          startDate.setDate(startDate.getDate() + interval);
        }

        const today = new Date().toISOString().split("T")[0];

        if (recordDates.includes(today)) {
          let yuakism = await YourModel.findById(id)
          let newyoua
          let splittedDate
          if (yuakism) {
            if (adTypes.key == "rental") {
             newyoua = yuakism.active_on_bumpup_at
              splittedDate = newyoua.split("T")[0];
            }
            // Continue with the rest of your code...
          } else {
            console.log("No document found with the specified ID.");
            // Handle the case where the document is not found.
          }
        
          console.log(splittedDate,today);
          let document  = null ;
          if( splittedDate && splittedDate<today || newyoua == "null" || yuakism.active_on_bumpup_at == null) {
            console.log("yasadu",id);
            document = await YourModel.findById(id);
          }
          if (document) {
            console.log(document._id,"jkh bmbm");
            const convertedDate = new Date().toLocaleString('en-US', { timeZone: location_timezone });
            let jaid = convertedDate.replace(/\s/g, '');
            console.log(typeof(jaid),"fkmkcmk",`${jaid}`);
            const dateComponents = jaid.match(/(\d+)\/(\d+)\/(\d+),(\d+):(\d+):(\d+)(AM|PM)/);
console.log(dateComponents,"vvvv",convertedDate);
            if (dateComponents) {
              const month = parseInt(dateComponents[1], 10) - 1;
              const day = parseInt(dateComponents[2], 10);
              const year = parseInt(dateComponents[3], 10);
              let hour = parseInt(dateComponents[4], 10);
              const minute = parseInt(dateComponents[5], 10);
console.log(dateComponents);
              if (dateComponents[7] === "PM" && hour < 12) {
                hour += 12;
              } else if (dateComponents[7] === "AM" && hour === 12) {
                hour = 0;
              }

              const inputDate = new Date(year, month, day, hour, minute);
              const offset = new Date(inputDate.toLocaleString("en-US", { timeZone: location_timezone })).getTimezoneOffset();
              inputDate.setMinutes(inputDate.getMinutes() - offset);
              const new_date = new Date(inputDate).toISOString();
console.log(id);
              datas.push({
                id,
                inputDate,
                new_date,
              });

              await YourModel.updateOne({ _id: id }, { $set: { active_on_bumpup_at: new_date } });
            }
          }
        }
      }
    }

    console.log(datas);
    console.log("Cron job completed successfully");
  } catch (error) {
    console.error(error);
    console.log("Something went wrong in the cron job");
  }
});