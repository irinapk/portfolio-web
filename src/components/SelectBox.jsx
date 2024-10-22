import {useEffect, useState} from "react";
import ArrowDown from '../assets/images/select-arrow.svg';

export default function SelectBox(props) {

  const {id, defaultValue, height = 100, options = []} = props;
  const [open, setOpen] = useState(false);
  const selectId = `select-${id}-${Math.ceil(Math.random() * 10)}`;

  const [selected, setSelected] = useState(defaultValue);

  const onClickOutside = (e) => {
    if (e.target !== document.getElementById(selectId)) setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", onClickOutside);
    } else {
      document.removeEventListener("click", onClickOutside);
    }
    return () => {
      document.removeEventListener("click", onClickOutside);
    }
  }, [open])

  return (
    <div className="select-box"
         onClick={() => setOpen(!open)}>
      <span id={selectId}>
        {selected ?? ""}
        <ArrowDown />
      </span>
      <div className={!open ? "select-options" : "select-options add-overflow"}
           style={open ? {height: height, maxHeight: height, borderWidth: 1} : {height: 0, maxHeight: 0, borderWidth: 0}}>
        <ul>
          {options.map((option, idx) => (
            <li key={id + "-option-" + idx}
                onClick={() => setSelected(option)}>
              {option}
            </li>
          ))}
          {(!options || options.length === 0) &&
            <li key={id + "-option-none"}>-</li>
          }
        </ul>
      </div>
    </div>
  )
}