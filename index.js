const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
let profileData = {};

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

app.get("/linkedin-profile-scraper/:username", async (req, res) => {
    try {
        const { username } = await req.params;
        let profileUrn = await getProfileUrn(username);
        await getMiddleProfile(username,encodeURIComponent(profileUrn?.included?.[0]?.entityUrn));
        await getAboutSection(username,encodeURIComponent(profileUrn?.included?.[0]?.entityUrn));
        await getAllSkill(username,encodeURIComponent(profileUrn?.included?.[0]?.entityUrn));
        await getContactInfo(username);
        res.send({status: "success", data:profileData})
    } catch (f) {
        res.send(f.message);
    }
});

async function getProfileUrn(username) {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(vanityName:${username})&&queryId=voyagerIdentityDashProfiles.07adfdb5c9ddb130d5d0dc2821c06665`, {
            "headers": {
              "accept": "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-GB,en;q=0.9",
              "csrf-token": "ajax:4408254985480240734",
              "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
              "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base;2tbR3cNuRzSZdj5+/IJt1A==",
              "x-li-pem-metadata": "Voyager - Profile=profile-tab",
              "x-li-track": "{\"clientVersion\":\"1.12.8893\",\"mpVersion\":\"1.12.8893\",\"osName\":\"web\",\"timezoneOffset\":5.5,\"timezone\":\"Asia/Calcutta\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2890,\"displayHeight\":908}",
              "x-restli-protocol-version": "2.0.0",
              "cookie": "lang=v=2&lang=en-us; bcookie=\"v=2&8a6579ae-a9c2-419b-85da-384cdb2bb543\"; bscookie=\"v=1&20230101191233c76fb9c4-4da9-41e5-803d-6ff848461e51AQHRl83VBHfz4w3c_XL7k1315PHZdrd9\"; liap=true; JSESSIONID=\"ajax:4408254985480240734\"; li_sugr=a7e9b8db-91b7-4345-baa7-b8b53f468382; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASDrvlkDTDnaAAABhW7AGzwAAAGJNT_oN04ARorNBCL9vTpD9RaWr8Rgac9BsIWepDI7i1-teY9e2_WVrWxVRBqM7N_U6Z2pe7RUqLQaOgagU1oPfIrkKfc38mKam0iii0fjWXEg8G0UG_Vpp62f; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; _gcl_au=1.1.171327196.1688233408; AnalyticsSyncHistory=AQL-22kkWBOOlAAAAYkhkfjiaYYS9uAz6P-yXs-K6CsVh9zdBPCw5aEiMgZ1GJfVoAdZa9ch7gbyV2daiPe0uQ; lms_ads=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; lms_analytics=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19544%7CMCMID%7C71485552673776034429222317137397887890%7CMCOPTOUT-1688589435s%7CNONE%7CvVersion%7C5.1.1; UserMatchHistory=AQI6jOrE6kWkjwAAAYknWF-F9VwqHYKnAhuAnKGBHb2IvXF9M-791MNHuuyY1OBWcRWSedP4kS3fJwpTkpSBM_KnsMGy2DxWE_pV6AxCAyiS2IAmJHPgtUujWWC4927Mp8ohYJmRiyWIKq7-6TMehfCV-yPS4lYsHrggm07DpbXRFIAFpzqx7nE6fLZ4GB4FVRGfp8NDfya9RnUxwk6jUrreQkLSDXCIvPMMRUqHhhecStzYKOAKar-KTNog7SDZMQ8KXTzrWN-pkuyHSUAfzSMTzxwF83HPjiNdi6tg4ResdYSrQUVJOzTQUTz9QuHPE9gLD3xBuRJ3BmIZWPMXHgNbac7Jha4; lidc=\"b=OB01:s=O:r=O:a=O:p=O:g=5294:u=1124:x=1:i=1688582251:t=1688620029:v=2:sig=AQG84pleqPXoVrRtf5Z9I5XB4Y0ucqeD\"",
              "Referer": `https://www.linkedin.com/in/${username}/`,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          return await res.json();
    } catch(e) {
        console.log(e);
    }
}

async function getAboutSection(username, urn) {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:${urn})&&queryId=voyagerIdentityDashProfileCards.3c16e320676acb02602ae17c4556669d`, {
            "headers": {
              "accept": "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-GB,en;q=0.9",
              "cache-control": "no-cache",
              "csrf-token": "ajax:4408254985480240734",
              "pragma": "no-cache",
              "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
              "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base;Fqx+xnJWSRitNFnEAgfrfw==",
              "x-li-pem-metadata": "Voyager - Profile=profile-tab-initial-cards",
              "x-li-track": "{\"clientVersion\":\"1.12.8893\",\"mpVersion\":\"1.12.8893\",\"osName\":\"web\",\"timezoneOffset\":5.5,\"timezone\":\"Asia/Calcutta\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2890,\"displayHeight\":908}",
              "x-restli-protocol-version": "2.0.0",
              "cookie": "lang=v=2&lang=en-us; bcookie=\"v=2&8a6579ae-a9c2-419b-85da-384cdb2bb543\"; bscookie=\"v=1&20230101191233c76fb9c4-4da9-41e5-803d-6ff848461e51AQHRl83VBHfz4w3c_XL7k1315PHZdrd9\"; liap=true; JSESSIONID=\"ajax:4408254985480240734\"; li_sugr=a7e9b8db-91b7-4345-baa7-b8b53f468382; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASDrvlkDTDnaAAABhW7AGzwAAAGJNT_oN04ARorNBCL9vTpD9RaWr8Rgac9BsIWepDI7i1-teY9e2_WVrWxVRBqM7N_U6Z2pe7RUqLQaOgagU1oPfIrkKfc38mKam0iii0fjWXEg8G0UG_Vpp62f; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; _gcl_au=1.1.171327196.1688233408; AnalyticsSyncHistory=AQL-22kkWBOOlAAAAYkhkfjiaYYS9uAz6P-yXs-K6CsVh9zdBPCw5aEiMgZ1GJfVoAdZa9ch7gbyV2daiPe0uQ; lms_ads=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; lms_analytics=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19544%7CMCMID%7C71485552673776034429222317137397887890%7CMCOPTOUT-1688592497s%7CNONE%7CvVersion%7C5.1.1; UserMatchHistory=AQLtY4zvTEiXZgAAAYknjbZgmdwYYXTTdEOKZ7dm19whFA2Litp6v1ItvGqnY-Gm-RupjESZjcuSW309362nRbhTvBGCekBuq_pvw4K9uwMonUHgZZN2DSTNnOj48hMv6Rvxq2wOvfYCa-3XkcLHkNUlc19H6LiEAmvoXoYdS3fQhfkxy3Kr49zzdCMcGDJVXn24wWp0YmoyAhTvZfSwqWhKXPTmW3fTOKMPj4bNzXoPU0GLHsT30bKYuaTBjtAub1M4OTYnFiLzkFm538qJcO9z8oT8UpSeGEZUWY5uNOxuHK3DGTlkhC7d2yO9OAuCbAv3ud0ymeBHLtOPf0lpmXpN3lBVjMI; lidc=\"b=OB01:s=O:r=O:a=O:p=O:g=5294:u=1124:x=1:i=1688585747:t=1688620029:v=2:sig=AQGltRWOVYhG6bIWWbFw9Py2Z_nyJlIT\"",
              "Referer": `https://www.linkedin.com/in/${username}/`,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          addAboutSection(await res.json());
    } catch(e) {
        console.log(e);
    }
}

async function addAboutSection(data) {
    profileData["About"] = getAbout(data);
    profileData["Experience"] = getExperience(data);
    profileData["Education"] = getEducation(data);
    profileData["Projects"] = getProjects(data);
    profileData["Certificates"] = getCertificates(data);
}

function getAbout(json) {
    const aboutComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "About"
        );
    });
    return aboutComponent?.topComponents?.[1]?.components?.textComponent?.text?.text;
}

function getExperience(json) {
    const expComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "Experience"
        );
    });
    return expComponent?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
        (e) => {
            const entity = e?.components?.entityComponent;
            return {
                Title: entity?.title?.text,
                CompanyName: entity?.subtitle?.text,
                Description: entity?.subComponents?.components?.[0]?.components?.fixedListComponent?.components?.[0]?.components?.textComponent?.text?.text,
                Dates: entity?.caption?.text,
                Lcation: entity?.metadata?.text,
                CompanyUrl: entity?.image?.actionTarget,
            };
        }
    );
}

function getEducation(json) {
    const educationComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "Education"
        );
    });
    return educationComponent?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
        (e) => {
            const entity = e?.components?.entityComponent;
            return {
                SchoolName: entity?.title?.text,
                Degree: entity?.subtitle?.text,
                Dates: entity?.caption?.text,
                SchoolUrl: entity?.image?.actionTarget,
            };
        }
    );
}

function getCertificates(json) {
    const certificatesComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "Licenses & certifications"
        );
    });
    return certificatesComponent?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
        (e) => {
            const entity = e?.components?.entityComponent;
            return {
                CertificateName: entity?.title?.text,
                SubTitle: entity?.subtitle?.text,
                Dates: entity?.caption?.text,
            };
        }
    );
}

function getProjects(json) {
    const projectComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "Projects"
        );
    });
    return projectComponent?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
        (e) => {
            const entity = e?.components?.entityComponent;
            let projectUrlObj = entity?.subComponents?.components?.[0]?.components?.actionComponent?entity?.subComponents?.components?.[0]?.components?.actionComponent:entity?.subComponents?.components?.[1]?.components?.actionComponent
            let projectDescObj = entity?.subComponents?.components?.[1]?.components?.fixedListComponent?entity?.subComponents?.components?.[1]?.components?.fixedListComponent:entity?.subComponents?.components?.[2]?.components?.fixedListComponent
            return {
                ProjectName: entity?.title?.text,
                Dates: entity?.subtitle?.text,
                ProjectUrl: projectUrlObj?.action?.navigationAction?.actionTarget,
                SubTitle: entity?.subComponents?.components?.[0]?.components?.insightComponent?.text?.text?.text,
                ProjectDesc: projectDescObj?.components?.[0]?.components?.textComponent?.text?.text
            };
        }
    );
}

async function getMiddleProfile(username, urn) {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:${urn})&&queryId=voyagerIdentityDashProfileCards.3f47d2f6aa35cba0808ad3aee2fbd3bb`, {
            "headers": {
              "accept": "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-GB,en;q=0.9",
              "cache-control": "no-cache",
              "csrf-token": "ajax:4408254985480240734",
              "pragma": "no-cache",
              "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
              "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base;2eekq9AYRqW+J1qs1rddAg==",
              "x-li-pem-metadata": "Voyager - Profile=profile-tab-deferred-cards",
              "x-li-track": "{\"clientVersion\":\"1.12.8893\",\"mpVersion\":\"1.12.8893\",\"osName\":\"web\",\"timezoneOffset\":5.5,\"timezone\":\"Asia/Calcutta\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2890,\"displayHeight\":908}",
              "x-restli-protocol-version": "2.0.0",
              "cookie": "lang=v=2&lang=en-us; bcookie=\"v=2&8a6579ae-a9c2-419b-85da-384cdb2bb543\"; bscookie=\"v=1&20230101191233c76fb9c4-4da9-41e5-803d-6ff848461e51AQHRl83VBHfz4w3c_XL7k1315PHZdrd9\"; liap=true; JSESSIONID=\"ajax:4408254985480240734\"; li_sugr=a7e9b8db-91b7-4345-baa7-b8b53f468382; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASDrvlkDTDnaAAABhW7AGzwAAAGJNT_oN04ARorNBCL9vTpD9RaWr8Rgac9BsIWepDI7i1-teY9e2_WVrWxVRBqM7N_U6Z2pe7RUqLQaOgagU1oPfIrkKfc38mKam0iii0fjWXEg8G0UG_Vpp62f; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; _gcl_au=1.1.171327196.1688233408; AnalyticsSyncHistory=AQL-22kkWBOOlAAAAYkhkfjiaYYS9uAz6P-yXs-K6CsVh9zdBPCw5aEiMgZ1GJfVoAdZa9ch7gbyV2daiPe0uQ; lms_ads=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; lms_analytics=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19544%7CMCMID%7C71485552673776034429222317137397887890%7CMCOPTOUT-1688587158s%7CNONE%7CvVersion%7C5.1.1; UserMatchHistory=AQLoOzTUtK0E_AAAAYknR_JnHdnu54UD5W_OMWwCsVMmRp7-2z7LRq6rtkxB-FGVpfIUk-CkSyL6eDNqDuFQaorhqut0fdz6iW-8f3PLlRaFSQb9kelqmW4k1BzPsJrSFlyxfC1pMUXCid64vKKWzUs23DaZqL8UjTy7NdFGksIGUHD1MwduvSl-3YKnSGe8aGd5ajVszAoPSnz50XBca6rg6o2ChyYxz31Tapoi6Q9vRMkfLLRGJZ7CCZs3Y2qcQ0UAnRcYMN9tqHP93YIx02tfuFHaoa1tWw8bkUmWDNm8OrpjNw1LL_ax715OeLD0kjhxoXikp9BORFya1fYZgAykwlGGrT0; lidc=\"b=OB01:s=O:r=O:a=O:p=O:g=5294:u=1124:x=1:i=1688581175:t=1688620029:v=2:sig=AQFupZUeuUWvli0n1zhUKrvTPx0Iyg0d\"",
              "Referer": `https://www.linkedin.com/in/${username}/`,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          addMidProfData(await res.json());
    } catch(e) {
        console.log(e);
    }
}

async function addMidProfData(data) {
    profileData["Name"] = data?.included?.[12]?.actor?.name?.text;
    profileData["Description"] = data?.included?.[12]?.actor?.description?.text;
    profileData["Testimonials"] = getTestimonials(data);
}

function getTestimonials(json) {
    const testimonialsComponent = json?.included?.find((d) => {
        return (
            d?.topComponents?.[0]?.components?.headerComponent?.title?.text ===
        "Recommendations"
        );
    });
    return testimonialsComponent?.topComponents?.[1]?.components?.tabComponent?.sections?.[0]?.subComponent?.components?.fixedListComponent?.components?.map(
        (e) => {
            const entity = e?.components?.entityComponent;
            return {
                Title: entity?.title?.text,
                SubTitle: entity?.subtitle?.text,
                Dates: entity?.caption?.text,
                Testimonial: entity?.subComponents.components?.[0]?.components?.fixedListComponent?.components?.[0]?.components?.textComponent?.text?.text
            }
        }
    );
}

async function getAllSkill(username, urn) {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:${urn},sectionType:skills,locale:en_US)&&queryId=voyagerIdentityDashProfileComponents.b7202de42ed588155dbc50de3622b379`, {
            "headers": {
              "accept": "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-GB,en;q=0.9",
              "csrf-token": "ajax:4408254985480240734",
              "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
              "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base_skills_details;e43nUICKTG+osRX60KU8Bw==",
              "x-li-track": "{\"clientVersion\":\"1.12.8893\",\"mpVersion\":\"1.12.8893\",\"osName\":\"web\",\"timezoneOffset\":5.5,\"timezone\":\"Asia/Calcutta\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2570,\"displayHeight\":908}",
              "x-restli-protocol-version": "2.0.0",
              "cookie": "lang=v=2&lang=en-us; bcookie=\"v=2&8a6579ae-a9c2-419b-85da-384cdb2bb543\"; bscookie=\"v=1&20230101191233c76fb9c4-4da9-41e5-803d-6ff848461e51AQHRl83VBHfz4w3c_XL7k1315PHZdrd9\"; liap=true; JSESSIONID=\"ajax:4408254985480240734\"; li_sugr=a7e9b8db-91b7-4345-baa7-b8b53f468382; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASDrvlkDTDnaAAABhW7AGzwAAAGJNT_oN04ARorNBCL9vTpD9RaWr8Rgac9BsIWepDI7i1-teY9e2_WVrWxVRBqM7N_U6Z2pe7RUqLQaOgagU1oPfIrkKfc38mKam0iii0fjWXEg8G0UG_Vpp62f; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; _gcl_au=1.1.171327196.1688233408; AnalyticsSyncHistory=AQL-22kkWBOOlAAAAYkhkfjiaYYS9uAz6P-yXs-K6CsVh9zdBPCw5aEiMgZ1GJfVoAdZa9ch7gbyV2daiPe0uQ; lms_ads=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; lms_analytics=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; UserMatchHistory=AQIql4koGNyIIwAAAYkqPKr8h-CdmiTP-MybcLd4Ed-yNugn229rDrGAsCzU8QQNsn4bz0GnVs0i3SJwMcGX7VfZZDqAqc68j6NlYmuiVMSbAsn1PaAmsW_l0yYZD81tlfEHSyOm-gYMfimJEDSskxRa_xb8s0i8K15WcCsX9XBZxuu8DcyU2xVctXmlX6N3e5j0-gtf-tTLWKyY91tPkomPRk36LzTuanINvjD_q1cqDcoXjMiVm25Y315l7oCEufopQUWhxLiCkk1vHSjECGygZo9JLernA5-j0xtgilLWnXOwzMHwu9pJ4YyAQCHIL8mapq0jVT86EFy4RzuEnN7FnRCdJiM; lidc=\"b=OB01:s=O:r=O:a=O:p=O:g=5295:u=1124:x=1:i=1688630768:t=1688677817:v=2:sig=AQHULFCdc4e2oaj4ub0C98WLb8jxZF2Q\"; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19544%7CMCMID%7C71485552673776034429222317137397887890%7CMCOPTOUT-1688638011s%7CNONE%7CvVersion%7C5.1.1",
              "Referer": `https://www.linkedin.com/in/${username}/details/skills/`,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          addSkills(await res.json());
    } catch(e) {
        console.log(e);
    }
}
async function addSkills(json) {
    const skillComponent = json?.data?.data?.identityDashProfileComponentsBySectionType?.metadata?.title === "Skills"?json:null;
    let skillMap = {};
    profileData["Skills"] = [];
    skillComponent?.included?.map( 
        (e) => {
            if(typeof e.components !== "undefined") {
                return e.components?.elements?.map(
                    (e) => {
                        const entity = e?.components?.entityComponent;
                        profileData["Skills"].push({
                            Title: entity?.title?.text,
                        });
                    }
                );
            }
        }
    );
}


async function getContactInfo(username) {
    try {
        const res = await fetch(`https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(memberIdentity:${username})&&queryId=voyagerIdentityDashProfiles.84cab0be7183be5d0b8e79cd7d5ffb7b`, {
            "headers": {
              "accept": "application/vnd.linkedin.normalized+json+2.1",
              "accept-language": "en-GB,en;q=0.9",
              "csrf-token": "ajax:4408254985480240734",
              "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-li-lang": "en_US",
              "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base_contact_details;jcUZ5GjkTWqa0eNg9fY8MA==",
              "x-li-track": "{\"clientVersion\":\"1.12.8893\",\"mpVersion\":\"1.12.8893\",\"osName\":\"web\",\"timezoneOffset\":5.5,\"timezone\":\"Asia/Calcutta\",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\",\"displayDensity\":2,\"displayWidth\":2570,\"displayHeight\":1150}",
              "x-restli-protocol-version": "2.0.0",
              "cookie": "lang=v=2&lang=en-us; bcookie=\"v=2&8a6579ae-a9c2-419b-85da-384cdb2bb543\"; bscookie=\"v=1&20230101191233c76fb9c4-4da9-41e5-803d-6ff848461e51AQHRl83VBHfz4w3c_XL7k1315PHZdrd9\"; liap=true; JSESSIONID=\"ajax:4408254985480240734\"; li_sugr=a7e9b8db-91b7-4345-baa7-b8b53f468382; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; li_at=AQEDASDrvlkDTDnaAAABhW7AGzwAAAGJNT_oN04ARorNBCL9vTpD9RaWr8Rgac9BsIWepDI7i1-teY9e2_WVrWxVRBqM7N_U6Z2pe7RUqLQaOgagU1oPfIrkKfc38mKam0iii0fjWXEg8G0UG_Vpp62f; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; _gcl_au=1.1.171327196.1688233408; AnalyticsSyncHistory=AQL-22kkWBOOlAAAAYkhkfjiaYYS9uAz6P-yXs-K6CsVh9zdBPCw5aEiMgZ1GJfVoAdZa9ch7gbyV2daiPe0uQ; lms_ads=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; lms_analytics=AQFHes0XHzPkbQAAAYkhkfnT2uGF18tDA-sTUbnMP6KxjJpG_By1xziZvDn06GNXCgD8jJC_DdiL9HaS-CDp-EAhaNiC9zmG; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19544%7CMCMID%7C71485552673776034429222317137397887890%7CMCOPTOUT-1688640485s%7CNONE%7CvVersion%7C5.1.1; UserMatchHistory=AQLDXyAN5S9fcgAAAYkqaaw8RRhMZ2Sam3q5XG74z44vF_AeJCWv-CSXfSDKjWv-kaD6hpKCcfk08XbDJ5oru8qX-66cnSIybmR52R9sOlXZMzhc2Tsa8NAwo2Qz7QPNQk0jNaVXRoyW4_uO_JsWbH1oLlenygRNCvsJBBbkbBUmsnFbCBl4xpS2J_fDAXSvJWoHQsI7JlEbBqmyn4MsurI2QTQXd83mDWndm37yibEKSxvP3otqIFO4Fz07B3eEIzd9XzTX8_4hp4otg69N7eCZbqfn7bQUVS5fPVUT_q7EgSh_37Lo86_PaGIlSPSinh8iqYiY0qB6CCm2Keo9tfUrw2kd18E; lidc=\"b=OB01:s=O:r=O:a=O:p=O:g=5295:u=1124:x=1:i=1688633716:t=1688677817:v=2:sig=AQGbKGv54wyOR66u_OC-n1Q05xYRnCoI\"",
              "Referer": `https://www.linkedin.com/in/${username}/`,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          addContactInfo(await res.json(), username);
    } catch(e) {
        console.log(e);
    }
}

function addContactInfo(json, username) {
    const contactComponent = json?.included?.find((d) => {
        return (
            d?.publicIdentifier ===
            username
        );
    });
    profileData["ContactInfo"] = {
        lastName: contactComponent?.lastName,
        firstName: contactComponent?.firstName,
        birthDateOn: contactComponent?.birthDateOn?.month+"-"+contactComponent?.birthDateOn?.day+" (MM-DD)",
        publicIdentifier: contactComponent?.publicIdentifier,
        address: contactComponent?.address,
        phoneNumbers: contactComponent?.phoneNumbers?.[0]?.phoneNumber?.number,
    };
}