export const PieChartComponent = ({ data, centerLabel, width, height, hideLabels}) => {
    const totalValue = data.reduce((prev,curr)=>prev+curr.value,0);
    let transformAngle = 0;
    return (
        <div className="flex">
            <svg height="125" width="150" viewBox="0 0 180 150" style={{width:width, height:height}} className="mr-2">
                <circle r="50" cx="75" cy="75" fill="white"/>
                {
                    data.map(p=>{
                        const arc = (<circle r="25" cx="75" cy="75" fill="transparent"
                                stroke={p.color}
                                strokeWidth="50"
                                strokeDasharray={`calc(${p.value*100/totalValue} * 157.8 / 100) 157.8`}
                                transform={`rotate(${transformAngle-90} 75 75)`}
                            />);
                        const sectionAngle = (2 * Math.PI * p.value / totalValue);
                        const label = (
                            <>
                                <line stroke="black" 
                                    x1={75+47.5*Math.sin(transformAngle * Math.PI / 180 + sectionAngle/2)} 
                                    y1={75-47.5*Math.cos(transformAngle * Math.PI / 180 + sectionAngle/2)}
                                    x2={75+52.5*Math.sin(transformAngle * Math.PI / 180 + sectionAngle/2)} 
                                    y2={75-52.5*Math.cos(transformAngle * Math.PI / 180 + sectionAngle/2)}
                                /> 
                                <text 
                                    x={75+67*Math.sin(transformAngle * Math.PI / 180 + sectionAngle/2)} 
                                    y={75-67*Math.cos(transformAngle * Math.PI / 180 + sectionAngle/2)+5}
                                    fontSize="12"
                                    fontWeight={700}
                                    textAnchor="middle"
                                >
                                    {p.label}
                                </text>
                            </>
                        );
                        transformAngle += 360 * p.value / totalValue ;
                        return (<>
                                    {arc}
                                    {label}
                                </>);
                    }
                    )
                }
                <circle r="25" cx="75" cy="75" fill="white" className="opacity-30"/>
                <circle r="23" cx="75" cy="75" fill="white"/>
                {
                    centerLabel &&
                    <text 
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        x={75} 
                        y={75}
                        fontSize="16"
                        fontWeight={800}
                    >
                        {centerLabel}
                    </text>
                }
            </svg>
            {
                hideLabels ?
                <></> :
                <div className="mt-[25px]">
                    {
                        data.map(p=>(
                            <div className="my-2">
                                <div className="flex gap-1">
                                    <div className="h-4 w-4 rounded-sm self-center" style={{backgroundColor:p.color}}></div>
                                    <div className="font-bold self-center">{p.label}</div>
                                </div>
                                <div className="my-0.5 mx-[18px]">{p.extraLabel}</div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}