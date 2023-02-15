export const LineGraphComponent = ({xaxis,yaxis,width,height,graphs,target,sum})=>{
    const xgap = width/(xaxis.values.length);
    const ygap = height/(yaxis.values.length-1);

    const ymin = Math.min(...yaxis.values);
    const ymax = Math.max(...yaxis.values);

    const pointToCoordinate = (p)=>{
        const yConvFactor = height/(ymax-ymin);
        return height-(p-ymin)*yConvFactor;
    }

    const graphArr = graphs.map(graph=>({
        dataPolygonPoints: graph.data.map((p,i)=>[60+xgap*(i),pointToCoordinate(p)]),
        graphColor: graph.graphColor,
        pointColor: graph.pointColor,
        data: graph.data,
        dashing: graph.dashing
    }));

    return (
        <div className="">
            {
                graphs.length>1 &&
                <div className="flex justify-center mt-4">
                    {
                        graphs.map((graph,i)=>(
                            <div key={i} className="flex mx-1">
                                <div className="self-center h-2 w-2 rounded-full mr-0.5" style={{backgroundColor:graph.graphColor}}/>
                                <div className="self-center text-xs">{graph.label}</div>
                            </div>
                        ))
                    }
                </div>
            }
            <div className="md:flex md:gap-8 md:mt-4">
                <svg height={height+60} width={width+80} viewBox={`0 0 ${width+40} ${height+60}`} className={`grow -translate-x-3 md:translate-x-0 ${graphs[0].prediction ? 'w-full h-full md:w-2/3' : 'w-full h-full'}`}>
                    <text x={60} y={15} textAnchor="middle" alignmentBaseline="baseline" fontWeight={700} fontSize={12} className="mt-4">{yaxis.label}</text>
                    <polygon
                        stroke="#000000"
                        strokeWidth={1}
                        points={`60,20 60,${height+20}`}
                    />
                    <polygon
                        stroke="#000000"
                        strokeWidth={1}
                        points={`60,${height+20} ${60+width},${height+20}`}
                    />
                    
                    {yaxis.values.slice(1,yaxis.values.length-1).map((p,i)=>(
                        <polygon
                            key={i}
                            stroke="#A8A9AC"
                            strokeWidth={1}
                            points={`${60},${height-(i+1)*ygap+20} ${60+width},${height-(i+1)*ygap+20}`}
                        />
                    ))}

                    {xaxis.values.map((p,i)=>(
                        <text
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            key={i}
                            x={60+xgap*(i)}
                            y={40+height}
                            fontSize="10"
                            fontWeight={600}
                            >
                        {p}
                        </text>
                    ))}

                    {yaxis.values.slice(1,yaxis.values.length-1).map((p,i)=>(
                        <text
                            textAnchor="end"
                            alignmentBaseline="middle"
                            key={i}
                            x={50}
                            y={height-ygap*(i+1)+20}
                            fontSize="10"
                            fontWeight={600}
                            >
                        {`${Math.floor(p)}.${Math.floor((p*10)%10)}`}
                        </text>
                    ))}
                    {
                        graphArr.map((graph,i) => (
                            <>
                                <polygon fill={graph.graphColor} points={`${graph.dataPolygonPoints[0][0]},${20+height} `+graph.dataPolygonPoints.map(p=>`${p[0]},${p[1]+20}`).join(' ')+` ${graph.dataPolygonPoints[graph.dataPolygonPoints.length-1][0]},${20+height}`}/>
                                <text x={graph.dataPolygonPoints.reduce((prev,curr)=>prev+curr[0], 0)/graph.dataPolygonPoints.length} y={10+height} alignment-baseline="baseline" text-anchor="middle" fontSize="12" fontWeight={700} fill="white">{sum}</text>    
                                {
                                    graph.dataPolygonPoints.slice(0,graph.dataPolygonPoints.length-1).map((p,i)=>(
                                        <line
                                            key={i}
                                            stroke={graph.graphColor}
                                            strokeWidth={3}
                                            strokeDasharray={graph.dashing}
                                            x1={p[0]}
                                            y1={p[1]+20}
                                            x2={graph.dataPolygonPoints[i+1][0]}
                                            y2={graph.dataPolygonPoints[i+1][1]+20}
                                        />
                                    ))
                                }
                                {
                                    graph.dataPolygonPoints.map((p,i)=>(
                                        <>
                                            <circle
                                                key={i}
                                                cx={p[0]}
                                                cy={p[1]+20}
                                                r="4" 
                                                stroke={graph.pointColor}
                                                strokeWidth={2} fill="white"
                                                className=""
                                            >
                                            </circle>
                                        </>
                                    ))
                                }
                            </>
                        ))
                    }

                    {
                        target &&
                        <>
                            <text
                                textAnchor="end"
                                alignmentBaseline="baseline"
                                x={60+width-7}
                                y={20+pointToCoordinate(target.value)-7}
                                fontSize="12"
                                fontWeight={600}
                            >
                                {target.label}
                            </text>
                            <rect
                                x={60}
                                y={target.type==='gt' ? 20 : 20+pointToCoordinate(target.value)}
                                height={target.type==='gt' ? pointToCoordinate(target.value) : height-pointToCoordinate(target.value)}
                                width={width}
                                className=" fill-slate-500 opacity-10"
                        />
                        </>
                    }
                </svg>
            </div>
        </div>
    );
}