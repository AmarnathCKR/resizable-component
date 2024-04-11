const Component = ({ onUpdate, onAdd, data, title }) => {
   

    return (
        <div className="component">
            <h2>{title}</h2>
            <button onClick={() => onAdd({title})}>Add</button>
            <ul>
                {data && data.length > 0 ? data.map(({ value, _id }) => {
                    return <li key={_id}>
                        {value} <button onClick={() => onUpdate({title, id : _id, value})}>Edit</button>
                    </li>
                }) : "No items found"}
            </ul>
        </div>
    );
};

export default Component