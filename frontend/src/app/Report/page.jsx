'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [dropdownToggled, setDropdownToggled] = useState(false)
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [selectedParkName, setSelectedParkName] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [waitTime, setWaitTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const dropdownRef = useRef(null)
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

  function homeClick(){
    router.push('/');
  }

  function handleSubmit() {
    //send post request to api endpoint
    if(selectedParkId != null && selectedParkId >= 0 && waitTime >= 0){
      const data = {
        'park_id': selectedParkId,
        'wait_time': waitTime
      };
      fetch(baseUrl + '/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Inform the server that JSON data is being sent
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data);
        setSuccessMessage("Report Succesfully Made");
      });
    }
    else{
      setSuccessMessage("Invalid Report Data");
    }
    
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
              <span>{selectedParkName ? selectedParkName : "Select Park"}</span>
              <span>{dropdownToggled ? '-' : '+'}</span>
            </button>
            <div className={`options ${dropdownToggled ? "visible" : ""}`}>
              {dropdownOptions.map((option, index) => {
                return (
                  <button 
                  key={index}
                  onClick={() => {
                    setSelectedParkName(option.name)
                    setSelectedParkId(option.id)
                    setDropdownToggled(false)
                  }}>{option.name}</button>
                )
              })}
            </div>
          </div>

          <div className="myLabel">
              Wait Time Estimation (in minutes): 
          </div>
          <div >
            <input name="waitTime" value={waitTime} onChange={e => setWaitTime(e.target.value)}/>
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
          <div className="myResult">
              {successMessage}
          </div>
        </div>
        <div className="buttonDiv">
          <button className="homeButton fiftyWidth" type="submit" onClick={homeClick}>Home</button>
          <button className="pageButton fiftyWidth" type="submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="imageSpace">
        <img className="courtImage" src="Pickleball_game.jpg" alt="Court Image"></img>
      </div>
    </div>
  );
}


//className={`${selectedPark.id === option.id ? "selected" : ""}`}