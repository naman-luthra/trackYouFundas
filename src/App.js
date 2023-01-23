import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataArray } from "./dataSlice";
import { loadHistory, sendData } from "./dataThunks";

export const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(loadHistory());
  },[dispatch]);
  const [ weight, setWeight ] = useState();
  const [ water, setWater ] = useState();
  const [ food, setFood ] = useState();
  const [ excercise, setExcercise ] = useState();

  const history = useSelector(dataArray);
  const today = history.find(day=>{
    const date = new Date(day.date).toDateString();
    const today = new Date().toDateString();
    return (date===today);
  });
  
  useEffect(()=>{
    if(!today) return;
    setWeight(today.weight);
    setWater(today.water);
    setFood(today.food);
    setExcercise(today.excercise);
  },[today]);

  return (
    <div className="App p-16 flex gap-8 justify-between">
      <div className="grid grid-cols-4 gap-3 w-1/4 items-center">
        <div>Weight: </div>
        <div className="col-span-3 border p-1 grid grid-cols-5">
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="focus:outline-none col-span-4"/>
          <div className="text-right">Kg</div>
        </div>
        <div>Water: </div>
        <div className="col-span-3 border p-1 grid grid-cols-5">
          <input type="number" value={water} onChange={e=>setWater(e.target.value)} className="focus:outline-none col-span-4"/>
          <div className="text-right">L</div>
        </div>
        <div>Food: </div>
        <div className="col-span-3 border p-1 grid grid-cols-5">
          <input type="number" value={food} onChange={e=>setFood(e.target.value)} className="focus:outline-none col-span-4"/>
          <div className="text-right">KCal</div>
        </div>
        <div>Excercise: </div>
        <div className="col-span-3 border p-1 grid grid-cols-5">
        <input type="number" value={excercise} onChange={e=>setExcercise(e.target.value)} className="focus:outline-none col-span-4"/>
          <div className="text-right">KCal</div>
        </div>
        <div className="col-span-4 flex justify-end">
          <button onClick={()=>{dispatch(sendData({data: {weight, water, food, excercise, _id: today ? today._id : null}}))}} className="text-center px-4 py-1.5 font-bold border-gray-600 text-gray-600 border-2 rounded-md hover:bg-gray-600 hover:text-white">Update Data</button>
        </div>
      </div>
      <div className="w-1/3 grid grid-cols-6 text-center gap-4 h-fit">
        <div className="font-bold col-span-2">Date</div>
        <div className="font-bold">Weight</div>
        <div className="font-bold">Water</div>
        <div className="font-bold">Food</div>
        <div className="font-bold">Excercise</div>

        {
          history.map(day=>(
            <>
              <div className="col-span-2">{new Date(day.date).toLocaleDateString()}</div>
              <div className="">{day.weight ? `${day.weight} Kg`: '-'}</div>
              <div className="">{day.water ? `${day.water} L`: '-'}</div>
              <div className="">{day.food ? `${day.food} KCal`: '-'}</div>
              <div className="">{day.excercise ? `${day.excercise} KCal`: '-'}</div>
            </>
          ))
        }
      </div>
    </div>
  );
}
