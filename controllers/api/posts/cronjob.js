const cron = require("node-cron");
const mongoose = require("mongoose");

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
      const documents = await Model.find({$and:[
       { "plan_validity.expired_on": { $lt: new Date().toISOString }},
       { status: "active"},
      ]
      });

      for (const document of documents) {
        console.log(document);
        // Parse the string to a Date object
        const expiredOnDate = new Date(document.plan_validity.expired_on);

        // Get the timezone offset from the document's "plan_validity.expired_on" field
        const documentTimezoneOffset = expiredOnDate.getTimezoneOffset();
        console.log(documentTimezoneOffset);
        // Calculate the adjustclged time using the document's timezone offset
        const adjustedTime = new Date(new Date().getTime() + documentTimezoneOffset * 60000);
        console.log(adjustedTime.toISOString(),"rv drvffbdfbfrbd");
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

        console.log(`Updated documents in ${adType.key}:`, result);
      }
    }

    console.log("Cron job executed successfully");
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
