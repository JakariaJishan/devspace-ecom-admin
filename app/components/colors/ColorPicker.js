"use client"
import {HexColorPicker} from "react-colorful";
import {useState} from "react";
import './style.css'
import CreateColorForm from "@/app/components/colors/CreateColorForm";

const ColorPicker = ({mode, setColorList, colorList, fetchColor}) => {
  const [color, setColor] = useState(mode === "edit" ? fetchColor?.hex_code : "#23db73");

  return <section className="resposive example">
    <HexColorPicker color={color} onChange={setColor}/>
    <CreateColorForm color={color} mode={mode} fetchColor={fetchColor} colorList={colorList} setColorList={setColorList}/>
  </section>;

}

export default ColorPicker;