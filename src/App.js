import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import "./App.css";
import Component from "./components/Component";
import { getAnyApi, PostAnyApi } from "./services/apiServices";
import Modal from "react-modal";

const App = () => {
  const [sizes, setSizes] = useState([
    { width: 0, height: 500 },
    { width: 0, height: 500 },
    { width: 0, height: 500 }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState(null)

  const [trigger, setTrigger] = useState(false)

  const [allData, setAllData] = useState(null);

  const [addCount, setAddCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    getAnyApi("")
      .then((response) => {
        console.log(response.data)
        setAllData(response.data)
      }).catch((err) => {
        console.log(err)
      })
    getAnyApi("count").then((res) => {
      setAddCount(res.data.addCount.length)
      setUpdateCount(res.data.updateCount.length)
    })
  }, [trigger])

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const initialWidth = screenWidth / 3 - 9;
    const initialSizes = [{ width: initialWidth, height: 500 }, { width: initialWidth, height: 500 }, { width: initialWidth, height: 500 }];
    setSizes(initialSizes);
  }, []);

  const handleResize = (index, width, height) => {
    const newSizes = [...sizes];
    const screenWidth = window.innerWidth;
    const diff = width - newSizes[index].width;

    // Resize the target component
    newSizes[index] = { width, height };

    // Adjust the neighboring component
    if (index < newSizes.length - 1) {
      newSizes[index + 1] = { width: newSizes[index + 1].width - diff, height: newSizes[index + 1].height };
    } else if (index > 0) {
      newSizes[index - 1] = { width: newSizes[index - 1].width - diff, height: newSizes[index - 1].height };
    }

    // Ensure that no component width becomes negative
    newSizes.forEach((size, i) => {
      if (size.width < 0) {
        newSizes[i] = { width: 0, height: size.height };
      }
    });

    // Ensure that total width doesn't exceed screen width
    const totalWidth = newSizes.reduce((acc, curr) => acc + curr.width, 0);
    if (totalWidth > screenWidth) {
      const diff = totalWidth - screenWidth;
      if (index < newSizes.length - 1) {
        newSizes[index + 1] = { width: newSizes[index + 1].width - diff, height: newSizes[index + 1].height };
      } else if (index >= 0) {
        newSizes[index - 1] = { width: newSizes[index - 1].width - diff, height: newSizes[index - 1].height };
      }
    }

    setSizes(newSizes);
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCancel = () => {
    setInputValue('');
    setMode(null)
  };

  const handleSave = () => {
    // You can do something with the input value here
    console.log('Input Value:', inputValue);
    PostAnyApi(mode && mode.id ? "update" : "add", mode && mode.id ? { value: inputValue, componentId: mode.title, itemId: mode.id } : { componentId: mode.title, value: inputValue })
      .then((response) => {
        setMode(null)
        setInputValue('');
        setTrigger(!trigger)
      }).catch((err) => {
        console.log(err)
      })

  };

  

  return (<>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
      <h4>Add Count: {addCount}</h4>
      <h4>Update Count: {updateCount}</h4>
    </div>
    <div className="app">
      {mode && <Modal
        isOpen={Boolean(mode)}
        contentLabel={mode ? mode.title : ""}
        className="custom-modal" // Apply custom class for styling
      >
        <h2 className="modal-title">{mode.title}</h2>
        <div className="input-container">
          <label htmlFor="input" className="input-label">Input:</label>
          <input
            type="text"
            id="input"
            className="input-field"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div className="button-container">
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </Modal>}

      <div className="container">
        <Resizable
          className="resizable-box"
          size={sizes[0]}
          onResizeStop={(event, direction, ref, d) => handleResize(0, ref.offsetWidth, ref.offsetHeight)}
        >
          <Component onAdd={(data) => setMode(data)} onUpdate={(data) => { setMode(data); setInputValue(data.value) }} title="componentOne" data={allData?.componentOne} />
        </Resizable>
        <Resizable
          className="resizable-box"
          size={sizes[1]}
          onResizeStop={(event, direction, ref, d) => handleResize(1, ref.offsetWidth, ref.offsetHeight)}
        >
          <Component onAdd={(data) => setMode(data)} onUpdate={(data) => { setMode(data); setInputValue(data.value) }} title="componentTwo" data={allData?.componentTwo} />
        </Resizable>
        <Resizable
          className="resizable-box"
          size={sizes[2]}
          onResizeStop={(event, direction, ref, d) => handleResize(2, ref.offsetWidth, ref.offsetHeight)}
        >
          <Component onAdd={(data) => setMode(data)} onUpdate={(data) => { setMode(data); setInputValue(data.value) }} title="componentThree" data={allData?.componentThree} />
        </Resizable>
      </div>
    </div>
  </>
  );
};



export default App;