# Contentful

Contentful is a headless CMS, and is the API-first content management platform to create, manage and publish content on any digital channel.

In other words, you can store all your data on Contentful, and can then access it via the APIs provided. This helps you to maintain a central store for all your data which you can then retrieve in any application that you build.

Please refer to the [official documentation](https://www.contentful.com/developers/docs/) for more information.

## Registration

Head over to [Contenful](https://www.contentful.com/) and sign up for a free account. You can also sign up for a paid version but the free tier is sufficient for your portfolio website needs.

### Free Tier Limits

As of this writing, the following are the usage limits for free tier:

| Contentful Feature         | Usage Limit |
| -------------------------- | ----------- |
| Entries                    | 25000       |
| Assets                     | 25000       |
| Records (Entries + Assets) | 25000       |
| Content Types              | 48000       |
| Locales                    | 2           |

## Content Types

Content Type is analogous to a schema in databases. You can define a content type with certain fields, their type (text, boolean, data, URL etc.), set default values for those fields, among other things.

Once you have registered and created your space on Contentful, it will ask you to create content types. For our portfolio projects, the following sections retrieve data from Contentful.

- Jobs (Experience)
- Projects
  - Featured
  - Other noteworthy projects
  - Projects Archive
- Awards
- Publications

Each of the main bulletted points will be respresented by a content type which we will see in the following sections.

### Jobs

Content Type Name: **experience**

| Field       | Data Type   |
| ----------- | ----------- |
| title       | short text  |
| company     | short text  |
| location    | short text  |
| url         | short text  |
| description | rich text   |
| range       | short text  |
| date        | date & time |

### Projects

Content Type Name: **project**

| Field    | Data Type           |
| -------- | ------------------- |
| title    | short text          |
| tech     | short text, list    |
| source   | short text          |
| cover    | media, single image |
| link     | short text          |
| abstract | long text           |
| range    | short text          |
| date     | date & time         |
| featured | boolean             |

### Awards

Content Type Name: **award**

| Field       | Data Type        |
| ----------- | ---------------- |
| title       | short text       |
| company     | short text       |
| description | rich text        |
| tech        | short text, list |
| date        | date & time      |

### Publications

Content Type Name: **publication**

| Field      | Data Type   |
| ---------- | ----------- |
| title      | short text  |
| conference | short text  |
| abstract   | long text   |
| link       | short text  |
| visible    | boolean     |
| date       | date & time |

## Adding Data

Once the content types have been created, you can click on the _Content_ tab in your Contentful space to add data.

### Projects

The projects that you want to be displayed under _Featured Projects_ section must have `featured = true` in the corresponding entries.

All _featured projects_ must also have an image upload to the `cover` field.

The projects that you want to be displayed under _Other Noteworthy Projects_ section must have `featured = false` in the corresponding entries.

The _archive_ page displays all the projects present in Contentful.

### Publications

The publications that you want to displayed under _Publications_ sections must have `visible = true`.

### Customization

You can add more fields as per your liking. Whatever you add needs to be also added to the static queries present on the respective page `.js` files so that Gatsby can pull this data from Contentful.

## Accessing Data

To access the data, you need 2 things

- Space ID
- Content Delivery API - access token

Follow these steps to retrieve this information from Contentful:

- In your Contentful space, head over to _Settings_ > _API Keys_.
- Click on the _Content delivery / preview tokens_ tab.
- Click on the name of your space.
- You would see the _Space ID_ and _Content Delivery API - access token_.
- Create a file named `.env` in the root/parent folder of this GitHub repo, and enter the following information:

```yaml
CONTENTFUL_SPACE_ID=<your Space ID>
CONTENTFUL_ACCESS_TOKEN=<your Content Delivery API - access token>
```

> **Please DO NOT commit these values to your GitHub repo.**

Once all these steps have been performed, please return to [the main README](../README.md#-installation--set-up) and continue with the instructions to set up and run the project.
