import { createClient } from "~/plugins/contentful.js";

async function fetchContentfulData(handle, contentType) {
    const contentfulClient = createClient();
    let contentfulData = {
        hidden: true,
        title: "",
        oneLiner: null,
        desc: "",
        bgColor: "",
        textColor: "#FFFFFF",
        image: ""
    };
    try {
        let entryData = await contentfulClient.getEntries({
        content_type: contentType,
        "fields.url": handle
        })
    if (entryData.items.length > 0) {
        let entry = entryData.items.shift();
        // if a required field is missing, hide content block section
        if (
        entry.fields.contentBlockImage ||
        entry.fields.contentBlockBgColor ||
        entry.fields.contentBlockText
        ) {
        contentfulData.hidden = false;
        contentfulData.title = entry.fields.contentBlockText.fields.title;
        contentfulData.desc =
            entry.fields.contentBlockText.fields.paragraph;
        contentfulData.bgColor = entry.fields.contentBlockBgColor;
        contentfulData.image =
            entry.fields.contentBlockImage.fields.file.url;
        // add text color if specified, else - white text
        if (entry.fields.contentBlockTextColor) {
            contentfulData.textColor = entry.fields.contentBlockTextColor;
        }
        }
        // add one-liner description
        if (entry.fields.oneLinerDescription) {
        contentfulData.oneLiner = entry.fields.oneLinerDescription;
        }
    }

    return contentfulData
    } catch (err){
        console.error(err)
    }
}

export default fetchContentfulData