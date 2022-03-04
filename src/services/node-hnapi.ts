import { CollectionType } from "../features/collection/collectionSlice";
import {
  getCategoryForIdCached,
  getCategoryIdForIdCached,
} from "./cacheHelper";

const API_URL = "https://node-hnapi.herokuapp.com/";

export interface Urlable {
  id: number;
  user: string;
  time: number;
  time_ago: string;
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
  getCollectionByCategory: async (type: CollectionType, page: string) => {
    if (type !== "business") {
      return [] as Item[];
    }

    let currentPage = parseInt(page);

    const fetchPage = (page: number) =>
      new Promise<Collection>((resolve, reject) => {
        fetch(`${API_URL}news?page=${page}`)
          .then((res) => res.json())
          .then((data: Item[]) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });

    const businessItems: Collection = [];
    while (businessItems.length < 10) {
      const items = await fetchPage(currentPage);
      for await (const item of items) {
        try {
          const cat = await getCategoryIdForIdCached(item.id);
          if (cat === 2) {
            businessItems.push(item);
          } else {
          }
        } catch (error) {
          console.log(item.id, "not found");
        }
      }
      currentPage++;
    }
    return businessItems;
  },

  getCategoryForIdCached,

  getCategory: (text: string) => {
    return new Promise<any>((resolve, reject) => {
      // post request using fetch
      fetch(
        `https://djqzjo0u82.execute-api.us-east-2.amazonaws.com/prod/hn_predictions`,
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
            `${prediction.label} (${(prediction.score * 100).toFixed(0)}%)  `
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
