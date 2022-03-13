import React, { useEffect, useState } from 'react';
import { setTitle } from '../../helpers';
import raw from 'raw.macro';
import exampleCollection from './exampleCollection.json';
import { Collection } from './Collection';
import { 
  api,
  TopicModel
} from '../../services/node-hnapi';


export const Topics: React.FC = () => {
  const [collection, setIsCollection] = useState<{[key:string]:any}>(exampleCollection)

  useEffect(() => {
    setTitle('topics');
    
  })

  useEffect(() => {
    const fetchTopics = async () => {
    for await (const topic of Object.values(TopicModel)) {
      const topicResponse = await api.getCollectionByCategory(topic,"1");
      setIsCollection((prevState)=>({...prevState, [topic]: topicResponse.slice(0,5)}))
    }
  }
  api.updateIndex()
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
          isFetching={false}
          page={  1}
          path={"topics"}/>:"Loading..."}</>}
   )}
    </div>
  )
};
