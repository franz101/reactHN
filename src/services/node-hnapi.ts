import { CollectionType } from "../features/collection/collectionSlice";

const API_URL = "https://node-hnapi.herokuapp.com/";
const LAMBDA_CLASSIFY_URL =  `https://djqzjo0u82.execute-api.us-east-2.amazonaws.com/prod/hn_predictions`
const LAMBDA_TOPIC_URL =  `https://mohp3enuma.execute-api.us-east-2.amazonaws.com`

export interface Urlable {
  id: number;
  user: string;
  time: number;
  time_ago: string;
}

export enum TopicModel  {
  BUSINESS="BUSINESS",
  HEALTH="HEALTH & LIVING",
  CULTURE="CULTURE & ARTS",
  EDUCATION="EDUCATION",
  SPORTS="SPORTS",
  NEWS="NEWS & POLITICS",
  TECH="TECH & SCIENCE",
}

export interface Story extends Urlable {
  id: number;
  title: string;
  domain: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  type: string;
  comments_count: number;
  url: string;
  label?: string;
  score?: number;
}

export type Collection = Story[];

export interface Item extends Story {
  comments: Comment[];
  content: string;
}

export interface Comment extends Urlable {
  level: number;
  user: string;
  time_ago: string;
  content: string;
  comments: Comment[];
}

export interface User {
  id: string;
  created_time: number;
  created: string;
  karma: number;
  avg: null;
  about: string;
}

export const api = {
  updateIndex: ()=>fetch(LAMBDA_TOPIC_URL),
  getCollection: (type: CollectionType, page: string) => {
    return new Promise<Collection>((resolve, reject) => {
      fetch(`${API_URL}${type}?page=${page}`)
        .then((res) => res.json())
        .then((data: Item[]) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getItem: (id: string) => {
    return new Promise<Item>((resolve, reject) => {
      fetch(`${API_URL}item/${id}`)
        .then((res) => res.json())
        .then((data: Item) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getUser: (id: string) => {
    return new Promise<User>((resolve, reject) => {
      fetch(`${API_URL}user/${id}`)
        .then((res) => res.json())
        .then((data: User) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getCollectionByCategory: async (topic: TopicModel, page: string) => {

  
    const fetchPage = () =>
      new Promise<Collection>((resolve, reject) => {
        fetch(`${LAMBDA_TOPIC_URL}/topics/${topic}?page=${page}`)
          .then((res) => res.json())
          .then((data) => {
            resolve(data.map(item=>{
              if(item.ID){
                item.id =item.ID
              }
              return item  
            }) as Item[] );
          })
          .catch((err) => {
            reject(err);
          });
      });

    return fetchPage();
  },


  getCategory: (text: string) => {
    return new Promise<any>((resolve, reject) => {
      // post request using fetch
      fetch(LAMBDA_CLASSIFY_URL
       ,
        {
          method: "POST",
          mode: "cors",
          credentials: "omit",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texts: [text],
          }),
        }
      )
        .then((res) => res.json())
        .then((data: any) => {
          const prediction = data.predictions[0];
          resolve(
            ` ${prediction.label} (${(prediction.score * 100).toFixed(0)}%)  `
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
