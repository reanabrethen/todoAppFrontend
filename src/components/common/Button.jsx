// rfce 'react functional component export'
//one big props obj
//can destructure props inside of arguments list
import React from 'react'

function Button({label, clickFunction, cssClass}) {
  return (
    <div>
        <button onClick={clickFunction} className={cssClass}>{label}</button> 
    </div>
  )
}

export default Button


// shell of a button below, feed props, mention component
{/* <button onClick={clickFunction} id={cssid}>{label}</button>  */}