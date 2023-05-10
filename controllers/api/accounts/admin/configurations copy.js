const mongoose = require("mongoose"),
    AdminConfigurations = mongoose.model("adminConfigurations"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AdsPlan = mongoose.model("addons_plan");

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
            top_price,
            top_currency,
            top_name,
            bump_isfree,
            bump_price,
            bump_currency,
            bump_name,
            highlight_isfree,
            highlight_price,
            highlight_currency,
            highlight_name,
            urgent_reduced_isfree,
            urgent_reduced_price,
            urgent_reduced_currency,
            urgent_reduced_name,
            homepage_gallery_isfree,
            homepage_gallery_price,
            homepage_gallery_currency,
            homepage_gallery_name,
            featured_isfree,
            featured_price,
            featured_currency,
            featured_name,
            link_website_isfree,
            link_website_price,
            link_website_currency,
            link_website_name,
            urgent_isfree,
            urgent_price,
            urgent_currency,
            urgent_name,
            spotlight_isfree,
            spotlight_price,
            spotlight_currency,
            spotlight_name,
        } = req.body;
        let adons_plan = []
        if (top_name) {

            let data = {
                isfree: top_isfree,
                name:  top_name,
                amount: top_price,
                currency:top_currency,
            }
            adons_plan.push(data)
        }
        if (bump_name) {

            let data = {
                isfree: bump_isfree,
                name:bump_name, 
                amount: bump_price,
                currency: bump_currency,
            }
            adons_plan.push(data)
        }
        if (highlight_name) {

            let data = {
                isfree: highlight_isfree,
                name:  highlight_name,
                amount: highlight_price,
                currency:highlight_currency,
            }
            adons_plan.push(data)
        }
        if (urgent_reduced_name) {

            let data = {
                isfree: urgent_reduced_isfree,
                name:  urgent_reduced_name,
                amount:urgent_reduced_price,
                currency: urgent_reduced_currency,
            }
            adons_plan.push(data)
        }
        if (homepage_gallery_name) {

            let data = {
                isfree: homepage_gallery_isfree,
                name:homepage_gallery_name,
                amount: homepage_gallery_price,
                currency:  homepage_gallery_currency,
            }
            adons_plan.push(data)
        }
        if (featured_name) {
            let data = {
                isfree: featured_isfree,
                name: featured_name,
                amount: featured_price,
                currency:featured_currency, 
            }
            adons_plan.push(data)
        }
        if (link_website_name) {
            let data = {
                isfree: link_website_isfree,
                name: link_website_name,
                amount: link_website_price,
                currency: link_website_currency,
            }
            adons_plan.push(data)
        }
        if (urgent_name) {
            let data = {
                isfree: urgent_isfree,
                name: urgent_name,
                amount: urgent_price,
                currency: urgent_currency,
            }
            adons_plan.push(data)
        }
        if (spotlight_name) {

            let data = {
                isfree: spotlight_isfree,
                name:spotlight_name,
                amount:  spotlight_price,
                currency:spotlight_currency, 
            }
            adons_plan.push(data)
        }


        const addTypePlan = new AdsPlan({
            is_active: is_active,
            visible: visible,
            name: name,
            duration: duration,
            ads_type: ads_type,
            "price.amount": price_amount,
            "price.isfree": price_isfree,
            "price.currency": price_currency,
            "add_ons": adons_plan,

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
                console.log(err,"jdnvdnjdnjd")
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        console.log(err,"jdnvdnjdnjd")
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
