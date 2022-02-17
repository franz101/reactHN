import { CollectionType } from "../features/collection/collectionSlice";
import { getCategoryForIdCached } from "./cacheHelper";

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
  getCategoryForIdCached,

  getCategory: (text: string) => {
    return new Promise<any>((resolve, reject) => {
      // post request using fetch
      fetch(`http://127.0.0.1:8000/category`, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      })
        .then((res) => res.json())
        .then((data: any) => {
          console.log(data);
          resolve(data.category.slice(0, 2).join(", "));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
