'use client'
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState()
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
    <div className="container">
      <form onSubmit={handleSubmit}>

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
                <button className={`${selectedPark.id === option.id ? "selected" : ""}`} 
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
            Text input: <input name="myInput" defaultValue="Some initial value"/>
          </label>
        </div>

        <div>
          <h1>Upload Photo</h1>
          <input type="file"/>
          <button type="submit">Select File</button>
        </div>

        <div>
          <label>
            Additional Details \(# of teams waiting, etc\):
            <textarea
              name="details"
              rows={4}
              cols={40}
            />
          </label>
        </div>


        <button type="submit">Cancel Submission</button>
        <button type="submit">Submit</button>

      </form>
    </div>
    
  );
}