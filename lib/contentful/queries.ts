export const allCoachesSchema: string = `query{
  allCoachs{
    edges{
      node{
        seo_title
        seo_meta_description
        name
        profile_image
        welcome_message
        biography
        book_time_photo
        appearance_order
      }
    }
  }
}`;

export const allReviewsSchema: string = `query{
  allReviewss{
    edges{
      node{
        featured
        name
        quote
        _meta {
          firstPublicationDate
        }
      }
    }
  }
}`;

export const allReviewsPageSchema: string = `query {
  allReviews_pages {
    edges{
      node{
        seo_title
        seo_meta_description
        banner_image
        page_title
      }
    }
  }
}`;

export const homePageSchema: string = `query{
  allHome_pages {
    edges{
      node {
        seo_title
        seo_meta_description
        banner_line_one
        banner_line_two
        banner_background_image
        featured_image
        featured_mesage_body
        featured_message_header
        block_widgets {
          widget_description
          widget_image
          widget_title
        }          
      }
    }
  }
}`;

export const servicesPageSchema: string = `query{
  allServices_pages{
    edges{
      node{
        seo_title
        seo_meta_description
        banner_image
        page_content{
          section_title
          section_content
        }
      }
    }
  }
}`;

export const ourStorySchema: string = `query{
  allOur_storys{
    edges{
      node {
        seo_title
        seo_meta_description
        banner_image
        title
        page_content
      }
    }
  }
}`;

export const podcastPageSchema: string = `query {
  allPodcast_pages{
    edges{
      node{
        seo_meta_description
        seo_title
        banner_image
      }
    }
  }
}`;

export const allBlogsSchema: string = `query {
  allBlog_posts {
    edges {
      node {        
        post_title
        sub_title
        slug_text
        publish_date
        featured_image
        author {
          ...on Coach {
            name
            
          }
        }
            
      }
    }
  }
}`;

export const blogPageSchema: string = `query {
  allBlog_pages {
    edges {
      node {
        title
        seo_title
        seo_meta_description
        banner_image
      }
    }
  }
}`;

export const blogPostSchema = (uid: string) => `query {
  blog_post(uid:"${uid}", lang:"en-us"){
    sub_title
    featured_image
    post_title
    post_content
    publish_date
    seo_meta_description
    seo_meta_title
    author {
      ... on Coach {
		    name
        profile_image
      }
    }
  }
}`;

export const simplePageQuery = (pageId: string) => `
  query simplePageEntryQuery {
  simplePage(id: "${pageId}") {
    pageTitle
    seoTitle
    seoMetaDescription
    banner {
      url
    }
  }
}
`;

export const homePageQuery = `
  query homePageEntryQuery {
    homePage(id: "6zvqa8rW0XXjmN5iYlUQ1V") {
      # add the fields you want to query
      seoTitle
      seoMetaDescription
      banner {
        url
      }
      mainBannerText
      subBannerText
      featuredImage {
        url
      }
      featuredMessageBody
      featuredMessageHeader
      widgetOneTitle
      widgetOneImage {
        url
      }
      widgetOneMessage
      widgetTwoTitle
      widgetTwoImage {
        url
      }
      widgetTwoMessage
      widgetThreeTitle
      widgetThreeImage {
        url
      }
      widgetThreeMessage
      widgetFourMessage
      widgetFourTitle
      widgetFourImage {
        url
      }
    }
  }
`;

export const coachesQuery = `query coachCollectionQuery {
  coachCollection {
    items {
      name
      appearanceOrder
      bookTimePhoto {
        url
        width
        height
      }
    }
  }
}`;

export const featuredReview = `query reviewCollectionQuery {
  reviewCollection(
    limit: 1,
    where:{
    featuredReview: true
  }) {
    items {
      name
      quote{
        json
      }
    }
  }
}`;

export const blogPostsQuery = `
  query blogPostCollectionQuery($limit: Int) {
    blogPostCollection(order: publishDate_DESC, limit: $limit) {
      total
      items {
        postTItle
        publishDate
        slugText
        outsideLink
        subTitle
        author {
          ... on Coach {
            name
            profileImage {
              url
              width
              height
            }
          }
        }
        featuredImage {
          url
          width
          height
        }
      }
    }
  }
`;

export const allBlogPostsQuery = `
query blogPostCollectionQuery {
  blogPostCollection {
    items {
      postTItle
      publishDate
      slugText
      subTitle
      author {
        ...on Coach {
          name
          profileImage {
            url
            width
            height
          }
        }
      }
      featuredImage {
        url
        width
        height
      }
    }
  }
}`;

export const podcastPageQuery = `
  query Podcasts($limit: Int) {
    podcastsCollection(order: published_DESC, limit: $limit) {
      total
      items {
        isAVideoLink
        title
        excerpt
        link
      }
    }
  }
`;

export const reviewsQuery = `
query reviewCollectionQuery {
  reviewCollection {
    items {
      name
      quote {
        json
      }
    }
  }
}`;

export const servicesPageQuery = `
  query pageEntryQuery {
  page(id: "crBLtmzvD0gln6LAC3NEV") {
    pageTitle
    seoTitle
    seoMetaDescription
    banner{
      url
    }
    pageContent {
      json
      links {
        assets {
          block {
             sys {
                  id
                }
                url
                title
                width
                height
                description
                contentType      
          }
        }
      }
    }
  }
}
`;

export const servicePageQuery = (slug: string) => `
  query servicePageCollectionQuery {
  servicePageCollection(
    where:{
    slugText:"${slug}"
  }, limit: 1) {
    items {
        pageTitle
        seoTitle
        seoMetaDescription
        slugText
        banner{
          url
          width
          height
        }
        coach{
        ... on Coach {
            name
            appearanceOrder
            bookTimePhoto {
                url
                width
                height
        } 
      }
    }
    pageContent {
      json,
      links {
        assets {
          block {
             sys {
                  id
                }
                url
                title
                width
                height
                description
                contentType 
          }
        }
      }
    }
  }
    }
  }

`;

export const blogPostQuery = (slug: string) => `
query blogPostCollectionQuery {
  blogPostCollection(where:{
    slugText: "${slug}"
  }, limit: 1) {
    items {
      postTItle
      publishDate
      slugText
      postContent {
        json
      }
      featuredImage {
        url
        width
        height
      }
      seoTitle
      seoMetaDescription
      author {
        ... on Coach {
          name
          profileImage {
            url
            width
            height
          }
        }
      }
    }
  }
}
`;

export const coachQuery = `
query coachCollectionQuery {
  coachCollection {
    items {
      name
      biography {
        json
      }
      profileImage {
        url
        width
        height
      }
      welcomeMessage {
        json
      }
  	  seoTitle
      seoMetaDescription
      
    }
  }
}`;

export const disclaimerPageQuery = `query disclaimerEntryQuery {
  disclaimer(id: "269coiWLwTnA1MgCxtsfHd") {
    sys {
      id
    }
    title
    secondaryTitle
    lastUpdated
    pageContent {
      json
    }
  }
}`;

export const interviewCollectionQuery = `query interviewsEntryQuery {
  interviewsCollection {
    total
    items {
      isOutsideLink
      description
      secondaryTitle
      title
      publication
      link
      publicationDate
      publicationImage {
        url
        width
        height
      }
    }
  }
}`;
