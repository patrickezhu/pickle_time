'use client'
import Image from "next/image";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  function button1Click(){
    router.push('/View');
  }

  function button2Click(){
    router.push('/Report');
  }

  return (
    <div className="container">
      <div>
        <div className="greenBubble">
          Pickle Time
        </div>
      </div>
      <div>
        <img className="homePageImage" src="what-is-pickleball-group-rally.jpg" alt="People playing PickleBall"></img>
      </div>
      <div>
        <div className="buttonContainer">
          <button onClick={button1Click} className="button1">View Busyness</button>
        </div>
        <div className="buttonContainer">
          <button onClick={button2Click} className="button2">Report Busyness</button>
        </div>
      </div>
    </div>
    
  );
}