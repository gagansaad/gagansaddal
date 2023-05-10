const mongoose = require("mongoose"),
    AdminConfigurations = mongoose.model("adminConfigurations"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AdsPlan = mongoose.model("adsplan");

exports.postconfigurations = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            main_categories,
            post_15_currency,
            post_15_ammount,
            post_30_currency,
            post_30_ammount,
            featured_15_currency,
            featured_15_ammount,
            featured_30_currency,
            featured_30_ammount,
            is_active,
        } = req.body;

        const configurations = await AdminConfigurations.findOne({
            main_categories,
        });

        if (configurations) {
            return failureJSONResponse(res, {
                message: `Main categories already exists`,
            });
        }

        const allconfigurations = new AdminConfigurations({
            adsType: PostType.id,
            "post_15.package.currency": post_15_currency,
            "post_15.package.ammount": post_15_ammount,
            "post_30.package.currency": post_30_currency,
            "post_30.package.ammount": post_30_ammount,
            "featured_15.package.currency": featured_15_currency,
            "featured_15.package.ammount": featured_15_ammount,
            "featured_30.package.currency": featured_30_currency,
            "featured_30.package.ammount": featured_30_ammount,
            is_active: is_active,
        });
        allconfigurations
            .save()
            .then((foundConfigurations) => {
                return successJSONResponse(res, {
                    message: `success`,
                    Configurations: foundConfigurations,
                });
            })
            .catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};
exports.posttypeconfigurations = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            is_active,
            visible,
            name,
            ads_type,
            price_isfree,
            price_amount,
            price_currency,
            duration,
            top_isfree,
            bump_isfree,
            highlight_isfree,
            urgent_reduced_isfree,
            homepage_gallery_isfree,
            featured_isfree,
            link_website_isfree,
            urgent_isfree,
            spotlight_isfree,
            top_price,
            bump_price,
            highlight_price,
            urgent_reduced_price,
            homepage_gallery_price,
            featured_price,
            link_website_price,
            urgent_price,
            spotlight_price,
            top_currency,
            bump_currency,
            highlight_currency,
            urgent_reduced_currency,
            homepage_gallery_currency,
            featured_currency,
            link_website_currency,
            urgent_currency,
            spotlight_currency,
            top_name,
            bump_name,
            highlight_name,
            urgent_reduced_name,
            homepage_gallery_name,
            featured_name,
            link_website_name,
            urgent_name,
            spotlight_name,
        } = req.body;

        let keysofprice={
            top_price,
            bump_price,
            highlight_price,
            urgent_reduced_price,
            homepage_gallery_price,
            featured_price,
            link_website_price,
            urgent_price,
            spotlight_price,
        }
        // let shouldStoreTrue = true;
        // for (const key of keysofprice) {
        //   if (req.body[key] == 0) {
        //     shouldStoreTrue
        //   }
        // }
        const addTypePlan = new AdsPlan({
            is_active: is_active,
            visible: visible,
            name: name,
            duration: duration,
            ads_type: ads_type,
            "price.amount": price_amount,
            "price.isfree": price_isfree,
            "price.currency": price_currency,
            "add_ons.isfree": top_isfree,
            "add_ons.isfree": bump_isfree,
            "add_ons.isfree": highlight_isfree,
            "add_ons.isfree": urgent_reduced_isfree,
            "add_ons.isfree": homepage_gallery_isfree,
            "add_ons.isfree": featured_isfree,
            "add_ons.isfree": link_website_isfree,
            "add_ons.isfree": urgent_isfree,
            "add_ons.isfree": spotlight_isfree,
            "add_ons.amount": top_price,
            "add_ons.amount": bump_price,
            "add_ons.amount": highlight_price,
            "add_ons.amount": urgent_reduced_price,
            "add_ons.amount": homepage_gallery_price,
            "add_ons.amount": featured_price,
            "add_ons.amount": link_website_price,
            "add_ons.amount": urgent_price,
            "add_ons.amount": spotlight_price,
            "add_ons.currency": top_currency,
            "add_ons.currency": bump_currency,
            "add_ons.currency": highlight_currency,
            "add_ons.currency": urgent_reduced_currency,
            "add_ons.currency": homepage_gallery_currency,
            "add_ons.currency": featured_currency,
            "add_ons.currency": link_website_currency,
            "add_ons.currency": urgent_currency,
            "add_ons.currency": spotlight_currency,
            "add_ons.name": top_name,
            "add_ons.name": bump_name,
            "add_ons.name": highlight_name,
            "add_ons.name": urgent_reduced_name,
            "add_ons.name": homepage_gallery_name,
            "add_ons.name": featured_name,
            "add_ons.name": link_website_name,
            "add_ons.name": urgent_name,
            "add_ons.name": spotlight_name,

        });
        addTypePlan
            .save()
            .then((foundTypeplan) => {
                return successJSONResponse(res, {
                    message: `success`,
                    Typeplan: foundTypeplan,
                });
            })
            .catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};
exports.gettypeconfigurations = async (req, res, next) => {
    try {
        AdsPlan.find()
            .then((result) => {
                if (!result) {
                    return failureJSONResponse(res, { message: `something went wrong` });
                }
                return successJSONResponse(res, { data: result });
            })
            .catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};
