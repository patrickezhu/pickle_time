'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [dropdownToggled, setDropdownToggled] = useState(false);
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [selectedParkName, setSelectedParkName] = useState(null);
  const dropdownRef = useRef(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [lastReported, setLastReported] = useState("Select a park to see");
  const [waitTime, setWaitTime] = useState("Select a park to see");
  const router = useRouter();

  const baseUrl = 'http://localhost:5000';

  useEffect(() => {
    function handleDropdown(e) {
      if(dropdownRef.current){
        if(!dropdownRef.current.contains(e.target)){
          setDropdownToggled(false)
        }
      }
    }

    fetch(baseUrl + '/api/parks')
    .then(response => response.json())
    .then(data => {
      setDropdownOptions(data.parks);
    });

    document.addEventListener('click', handleDropdown)

    return () => {
      document.removeEventListener('click', handleDropdown)
    }
  }, []);

  useEffect(() => {
    if(selectedParkId != null){
      fetch(baseUrl + '/api/park/' + selectedParkId)
      .then(response => response.json())
      .then(data => {
        setLastReported(data.last_reported);
        setWaitTime(data.wait_time);
      });
    }
  }, [selectedParkId]);

  function homeClick(){
    router.push('/');
  }

  return (
    <div>
      <div className="flexColumn infoSpace">
        <div className="container">
          <label className="myLabel">Choose Park</label>
          <div className="dropdown" ref={dropdownRef}>
            <button className="toggle" onClick={() => {
              setDropdownToggled(!dropdownToggled)
            }}>
              <span>{selectedParkName ? selectedParkName : "Select Park"}</span>
              <span>{dropdownToggled ? '-' : '+'}</span>
            </button>
            <div className={`options ${dropdownToggled ? "visible" : ""}`}>
              {dropdownOptions.map((option, index) => {
                return (
                  <button 
                  key={index}
                  onClick={() => {
                    setSelectedParkName(option.name);
                    setSelectedParkId(option.id);
                    setDropdownToggled(false)
                  }}>{option.name}</button>
                )
              })}
            </div>
          </div>

          <div className="myLabel">
              Current estimated wait time: 
          </div>
          <div className="myResult">
            {waitTime}
          </div>

          <div className="myLabel">
              Last Reported: 
          </div>
          <div className="myResult">
            {lastReported}
          </div>
        </div>
        <div className="buttonDiv">
          <button className="homeButton" type="submit" onClick={homeClick}>Home</button>
        </div>
      </div>
      <div className="imageSpace">
          <img className="courtImage" src="imagespace.png" alt="Court Image"></img>
      </div>
    </div>
  );
}