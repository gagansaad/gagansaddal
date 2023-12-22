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
        // console.log("raja ki rani se shaadi hai ");
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
          // console.log("haye mera kaalu");
          console.log(document,"kallu");
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


cron.schedule("*/15 * * * *", async (req, res) => {
  try {
    let datas;
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    console.log(currentISODate,' cron start dataa')
    var dbQuery = {
      $and: [
        { status: "active" },
        { "plan_validity.expired_on": { $gte: currentISODate } },
        { "addons_validity.name": "Bump up" },
      ],
    };

    let adTypes = [
      { key: "job", label: "Jobs" },
      { key: "event", label: "Events" },
      { key: "Buy & Sell", label: "Buy & Sell" },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" },
      { key: "Local_biz & Service", label: "Local Biz & Services" },
      { key: "rental", label: "Rentals" },
    ];
    let results = [];
    let adTypeCount;
    for (const adType of adTypes) {
      let YourModel = mongoose.model(adType.key);
      let checkAlreadyExist = await YourModel.find(dbQuery).exec();

      let bumpUpDates = checkAlreadyExist
        .map((data) => {
          // Filter addons_validity to get only the "Bump up" addon
          let bumpUpAddon = data.addons_validity.find(
            (addon) => addon.name === "Bump up"
          );
          console.log(bumpUpAddon,'data');
          const currentTimeInTimeZone = new Date().toLocaleString('en-US', { timeZone: data?.location_timezone});
          const currentHour = new Date(currentTimeInTimeZone).getHours();
          console.log(currentHour);
          if(currentHour === 7){
            if (bumpUpAddon) {
              const iter = bumpUpAddon.days == 30 ? 1 : bumpUpAddon.days;
              return {
                active_on: bumpUpAddon.active_on,
                expired_on: bumpUpAddon.expired_on,
                interval: iter, // Add the interval property
              };
            }
          }
          return null; // If "Bump up" addon is not found, return null
        })
        .filter((dates) => dates !== null);

      const resultDates = [];

      for (const dateRange of bumpUpDates) {
       
        const { active_on, expired_on, interval } = dateRange;
        // console.log(interval);
        const startDate = new Date(active_on);
        const endDate = new Date(expired_on);
        const recordDates = []; // Create a separate array for each record

        while (startDate <= endDate) {
          recordDates.push(startDate.toISOString().split("T")[0]);
          startDate.setDate(startDate.getDate() + interval);
        }

        resultDates.push(recordDates); // Push the record's dates array into the result array
      }
      console.log(resultDates);

      const today = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"
      let date_of_time = new Date().toISOString();



      // Filter adonsData to find records where resultDates array contains today's date
      console.log(checkAlreadyExist);
      const recordsWithTodayDate = checkAlreadyExist.filter((data, index) => {
        if (index < resultDates.length) {
            const recordDates = resultDates[index]; // Get the resultDates array for the current record
            console.log(recordDates, "tfjmmkm");
    
            return recordDates.includes(today);
        } else {
            // Handle the case where the index is out of bounds
            console.error("Index out of bounds for resultDates array");
            return false;
        }
    });
    
    console.log(recordsWithTodayDate);
    
      let bumpId = recordsWithTodayDate.map((featuredItem) => featuredItem._id);
      if (bumpId.length > 0) {
        for (const id of bumpId) {
          const document = await YourModel.findOne({
            $and: [
              { _id: id },
              {
                $or: [
                  { active_on_bumpup_at: { $lt: today } },
                  { active_on_bumpup_at: null }, // Add condition for active_on_bumpup_at < todayDate7am
                ],
              },
            ],
          });
          
          const converteddate_of_time = new Date(date_of_time).toLocaleString('en-US', {
            timeZone: document?.location_timezone,
          });
          const document_location_timezone = document?.location_timezone; // Replace with your actual time zone

// Parse the date string to extract components
const dateComponents = converteddate_of_time.match(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) (AM|PM)/);
let new_date
if (dateComponents) {
  const month = parseInt(dateComponents[1], 10) - 1; // Months are zero-based
  const day = parseInt(dateComponents[2], 10);
  const year = parseInt(dateComponents[3], 10);
  let hour = parseInt(dateComponents[4], 10);
  const minute = parseInt(dateComponents[5], 10);
  const ampm = dateComponents[6];

  // Rest of your code using the parsed components


// Adjust the hour for AM/PM
if (ampm === "PM" && hour < 12) {
  hour += 12;
} else if (ampm === "AM" && hour === 12) {
  hour = 0;
}

// Create a new Date object with the specified time zone
const inputDate = new Date(year, month, day, hour, minute);
const offset = new Date(inputDate.toLocaleString("en-US", { timeZone: document_location_timezone })).getTimezoneOffset();
inputDate.setMinutes(inputDate.getMinutes() - offset);
new_date = new Date(inputDate).toISOString()
console.log("Input Date:", inputDate,new_date);
} else {
  console.error("Invalid date format: " + converteddate_of_time);
}
          if (document) {
            // Update the document with the new value for active_on_bumpup_at
            datas =  await YourModel.updateOne(
              { _id: id },
              { $set: { active_on_bumpup_at: new_date } }
              // { $set: { active_on_bumpup_at: date_of_time } }
            );
          }
        }
      }
      
    }

    return successJSONResponse(res, { message: `success`, total: datas });
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
});
