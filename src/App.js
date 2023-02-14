import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataArray } from "./dataSlice";
import { loadHistory, sendData } from "./dataThunks";
import { PieChartComponent } from "./PieChartComponent";

export const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(loadHistory());
  },[dispatch]);
  const [ weight, setWeight ] = useState("");
  const [ water, setWater ] = useState("");
  const [ food, setFood ] = useState([]);
  const [ excercise, setExcercise ] = useState("");

  const [ addingFood, setAddingFood ] = useState(false);
  const [ name, setName ] = useState("");
  const [ carbs, setCarbs ] = useState("");
  const [ protein, setProtein ] = useState("");
  const [ fat, setFat ] = useState("");

  const clearAddFood = () => {
    setName("");
    setCarbs("");
    setProtein("");
    setFat("");
  };

  const addCurrentSelection = () => {
    setFood([...food, {name,carbs:parseFloat(carbs),protein:parseFloat(protein),fat:parseFloat(fat)}]);
  }

  const calculateTotalCalories = food => food.reduce((calCount, foodItem) => (calCount+(foodItem.carbs*4+foodItem.protein*4+foodItem.fat*9)),0)

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
  const caloriesFromProtein = today?.food.reduce((prev, foodItem)=>(prev+foodItem.protein*4),0);
  const caloriesFromCarbs = today?.food.reduce((prev, foodItem)=>(prev+foodItem.carbs*4),0);
  const caloriesFromFat = today?.food.reduce((prev, foodItem)=>(prev+foodItem.fat*9),0);
  const totalCalories = caloriesFromProtein+caloriesFromCarbs+caloriesFromFat;

  const bmr = 88.362 + (13.397 * today?.weight) + (4.799 * 177) - (5.677 * 20);
  const calorieDeficit = bmr+today?.excercise-totalCalories;

  const FoodData = [
    {
        value:caloriesFromProtein,
        color:"Green",
        label:"Protein",
        extraLabel:`${Math.round(caloriesFromProtein*1000/totalCalories)/10}% (${caloriesFromProtein}KCal)`
    },
    {
        value:caloriesFromCarbs,
        color:"#293462",
        label:"Carbs",
        extraLabel:`${Math.round(caloriesFromCarbs*1000/totalCalories)/10}% (${caloriesFromCarbs}KCal)`
    },
    {
      value:caloriesFromFat,
      color:"#FEDB39",
      label:"Fat",
      extraLabel:`${Math.round(caloriesFromFat*1000/totalCalories)/10}% (${caloriesFromFat}KCal)`
    },
  ];

  return (
    <div className="App p-8 md:p-16 grid md:grid-cols-2 gap-8 justify-between">
      <div className="grid grid-cols-4 gap-3 items-center">
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
        <div>Excercise: </div>
        <div className="col-span-3 border p-1 grid grid-cols-5">
          <input type="number" value={excercise} onChange={e=>setExcercise(e.target.value)} className="focus:outline-none col-span-4"/>
          <div className="text-right">KCal</div>
        </div>
        <div>Food</div>
        <div className="col-span-3 border p-2">
          <div className="grid grid-cols-12 gap-2 font-bold pl-3">
            <div className="col-span-4 truncate">Name</div>
            <div className="col-span-2">Calories</div>
            <div className="col-span-2">Carbs</div>
            <div className="col-span-2">Protein</div>
            <div className="col-span-2">Fat</div>
          </div>
          <div className="flex flex-col gap-1 mt-2 overflow-y-auto h-40">
            {
              food.map((item,i)=>(
                <div key={i} className="grid grid-cols-12 gap-2 pl-3 group relative">
                  <div onClick={()=>setFood(food.filter((item,index)=>(index!==i)))} className="text-xs font-bold hidden group-hover:block absolute left-0 top-1 hover:opacity-70 cursor-pointer">X</div>
                  <div className="col-span-4 truncate">{item.name}</div>
                  <div className="col-span-2">{item.carbs*4+item.protein*4+item.fat*9}</div>
                  <div className="col-span-2">{item.carbs}</div>
                  <div className="col-span-2">{item.protein}</div>
                  <div className="col-span-2">{item.fat}</div>
                </div>
              ))
            }
            {
              addingFood &&
              <div className="grid grid-cols-12 gap-2 pl-3 group relative">
                <div onClick={()=>{
                  addCurrentSelection();
                  clearAddFood();
                  setAddingFood(false);
                  }} className="text-xs font-bold hidden group-hover:block absolute left-0 top-1 hover:opacity-70 cursor-pointer">+</div>
                <input value={name} onChange={e=>setName(e.target.value)} type="text" className="focus:outline-none col-span-4 border"/>
                <div className="col-span-2">{carbs*4+protein*4+fat*9}</div>
                <input value={carbs} onChange={e=>setCarbs(e.target.value)} type="number" className="focus:outline-none border col-span-2"/>
                <input value={protein} onChange={e=>setProtein(e.target.value)} type="number" className="focus:outline-none border col-span-2"/>
                <input value={fat} onChange={e=>setFat(e.target.value)} type="number" className="focus:outline-none border col-span-2"/>
              </div>
            }
          </div>
          <div onClick={()=>{
            if(!addingFood) return setAddingFood(true);
            addCurrentSelection();
            clearAddFood();
            }} className="text-gray-500 font-semibold hover:text-gray-400 cursor-pointer pl-3">Add +</div>
        </div>
        <div className="col-span-4 flex justify-end">
          <button onClick={()=>{dispatch(sendData({data: {weight:parseFloat(weight), water:parseFloat(water), food, excercise:parseFloat(excercise), _id: today ? today._id : null}}))}} className="text-center px-4 py-1.5 font-bold border-gray-600 text-gray-600 border-2 rounded-md hover:bg-gray-600 hover:text-white">Update Data</button>
        </div>
      </div>
      <div className="h-fit">
        <div className="grid grid-cols-6 gap-4 text-center">
          <div className="font-bold col-span-2">Date</div>
          <div className="font-bold">Weight</div>
          <div className="font-bold">Water</div>
          <div className="font-bold">Food</div>
          <div className="font-bold">Excercise</div>
        </div>
        {
          history.map((day)=>(
            <div key={day.date} className="grid grid-cols-6 gap-4 text-center">
              <div className="col-span-2">{new Date(day.date).toLocaleDateString()}</div>
              <div className="">{day.weight ? `${day.weight} Kg`: '-'}</div>
              <div className="">{day.water ? `${day.water} L`: '-'}</div>
              <div className="">{day.food.length ? `${calculateTotalCalories(day.food)} KCal`: '-'}</div>
              <div className="">{day.excercise ? `${day.excercise} KCal`: '-'}</div>
            </div>
          ))
        }
        <div className="mt-8">
          <PieChartComponent data={FoodData} height="200px" width="250px"/>
        </div>
      </div>
    </div>
  );
}
