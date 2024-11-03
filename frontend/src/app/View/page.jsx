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



  return (
    <div>

      <div className="infoSpace">
        <label>Choose Park</label>
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

        <div>
          <label>
            Current estimated wait time: <input name="waitTime" readOnly={true}/>
          </label>
        </div>

        <div>
          <label>
            Last Reported: <input name="lastReport" readOnly={true}/>
          </label>
        </div>

        <button type="submit">Home</button>
      </div>


      <div className="imageSpace">
        <img className="courtImage" src="imagespace.png" alt="Court Image"></img>
      </div>

    </div>
  );
}