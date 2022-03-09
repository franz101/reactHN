import React, { useEffect, useState } from 'react';
import { setTitle } from '../../helpers';
import raw from 'raw.macro';
import Markdown from 'react-remarkable';
import { Collection } from './Collection';
import { 
  api,
  Collection as CollectionModel,
  TopicModel
} from '../../services/node-hnapi';
const markdown = raw("../../../README.md");

export const Topics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setIsCollection] = useState<{[key in TopicModel]? : CollectionModel}>(Object.assign({}, ...Array.from(Object.values(TopicModel), (k) => ({[k]: []}) )))
   
  useEffect(() => {
    setTitle('topics');
  })

  useEffect(() => {
    const fetchTopics = async () => {
    for await (const topic of Object.values(TopicModel)) {
      const topicResponse = await api.getCollectionByCategory(topic,"1");
      setIsCollection((prevState)=>({...prevState, [topic]: topicResponse.slice(5)}))
      setIsLoading(false)
     }
  }
  fetchTopics()
},[]
  
  )

  

  return (
    <div className="About">
      {/* <Markdown source={markdown} /> */}
         {

Object.entries(collection).map(([topic,topicCollection]) =>
         { 
         
         return <><h1>{topic}</h1>{topicCollection?.length ?<Collection  type={"news"}
          collection={topicCollection.slice(0,5)}
          isFetching={isLoading}
          page={  1}
          path={"topics"}/>:"Loading..."}</>}
   )}
    </div>
  )
};