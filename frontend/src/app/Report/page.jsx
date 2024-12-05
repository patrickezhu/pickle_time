'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [dropdownToggled, setDropdownToggled] = useState(false)
  const [selectedPark, setSelectedPark] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleDropdown(e) {
      if(dropdownRef.current){
        if(!dropdownRef.current.contains(e.target)){
          setDropdownToggled(false)
        }
      }
    }

    document.addEventListener('click', handleDropdown)

    return () => {
      document.removeEventListener('click', handleDropdown)
    }
  });

  const dropdownOptions = [
    {
      id: 1,
      label: "Leslie Park",
      value: "leslie-park",
    },
    {
      id: 2,
      label: "Gallup Park",
      value: "gallup-park",
    },
  ];


  function handleSubmit() {
    //send post request to api endpoint
  }

  return (
    

    <div>
      <div className="flexColumn infoSpace">
        <div className="container">
          <div className="myLabel">Create a Report</div>
          <div className="dropdown" ref={dropdownRef}>
            <button className="toggle" onClick={() => {
              setDropdownToggled(!dropdownToggled)
            }}>
              <span>{selectedPark ? selectedPark.label : "Select Park"}</span>
              <span>{dropdownToggled ? '-' : '+'}</span>
            </button>
            <div className={`options ${dropdownToggled ? "visible" : ""}`}>
              {dropdownOptions.map((option, index) => {
                return (
                  <button 
                  key={index}
                  onClick={() => {
                    setSelectedPark(option)
                    setDropdownToggled(false)
                  }}>{option.label}</button>
                )
              })}
            </div>
          </div>

          <div className="myLabel">
              Wait Time Estimation (in minutes): 
          </div>
          <div >
            <input name="waitTime"/>
          </div>

          <div className="myLabel">
            Upload Photo
          </div>
          <div>
            <input type="file"/>
          </div>

          <div className="myLabel">
              Additional Details (# of teams waiting, etc):
          </div>
          <div>
          <textarea
                name="details"
                rows={4}
                cols={40}
              />
          </div>
          <div>

          </div>
        </div>
        <div className="buttonDiv">
          <button className="homeButton fiftyWidth" type="submit">Home</button>
          <button className="pageButton fiftyWidth" type="submit">Submit</button>
        </div>
      </div>
      <div className="imageSpace">
        <img className="courtImage" src="imagespace.png" alt="Court Image"></img>
      </div>
    </div>
  );
}


//className={`${selectedPark.id === option.id ? "selected" : ""}`}