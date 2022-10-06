import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import './his.css';
import {
  LineChart,
  ResponsiveContainer,
  Legend, Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { FaCloudDownloadAlt } from "react-icons/fa";
import emailjs from '@emailjs/browser';
import SelectInput from "@mui/material/Select/SelectInput";
import { StyledEngineProvider } from "@mui/material";

const Home = (props) => {
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [data, setdata] = useState({});
  const [checker, setch] = useState("empty");
  const [ph, setph] = useState("");
  const [turbidity, setturbidity] = useState("");
  const [temperature, settemperature] = useState("");
  const [tds, settds] = useState("");
  const [phav, setphav] = useState("0");
  const [turbidityav, setturbidityav] = useState("0");
  const [temperatureav, settemperatureav] = useState("0");
  const [tdsav, settdsav] = useState("0");
  const [ph_plot, setph_plot] = useState("");
  const [turbidity_plot, setturbidity_plot] = useState("");
  const [temperature_plot, settemperature_plot] = useState("");
  const [tds_plot, settds_plot] = useState("");
  const [t, sett] = useState("");
  const [recent, setrecent] = useState("");
  const [from, setfrom] = React.useState(moment(new Date()).format("YYYY-MM-DD"));
  const [to, setto] = React.useState(moment(new Date()).format("YYYY-MM-DD"));
  const [from1, setfrom1] = React.useState();
  const [to1, setto1] = React.useState();
  const [ch, setchr] = React.useState("yo");
  const [averages, setaverages] = React.useState({
    'turbidity': 0,
    'temperature': 0,
    'tds': 0,
    'ph': 0
  });
  const [minimums, setminimums] = React.useState({
    'turbidity': 100000000,
    'temperature': 100000000,
    'tds': 100000000,
    'ph': 100000000
  })
  const [maximums, setmaximums] = React.useState({
    'turbidity': 0,
    'temperature': 0,
    'tds': 0,
    'ph': 0
  })
  const [fromTime, fromTimeSet] = useState("00:00")
  const [toTime, toTimeSet] = useState("23:59")


  const convertTime = (time) => {
    let [hours, minutes, seconds] = time.split(':');
    return `${hours}:${minutes}`;
 };

  const getAverageValues1 = (data1) => {
    console.log("damn!")
    var FromDate = from;
    var ToDate = to;
    var d1 = FromDate.split("-");
    var d2 = ToDate.split("-");

    var FromTime = fromTime;
    var ToTime = toTime;
    var d3 = FromTime.split(":");
    var d4 = ToTime.split(":");

    var fr = new Date(d1[0],d1[1],d1[2], d3[0], d3[1], "00", "00", "00");
    var tt = new Date(d2[0],d2[1],d2[2], d4[0], d4[1], "00", "00", "00");
    var pts = 0;
    var hyd = 0.0;
    var temp = 0.0;
    var turb = 0.0;
    var solids = 0.0;

    var turb_min = 100000000;
    var temp_min = 100000000;
    var tds_min = 100000000;
    var ph_min = 100000000;

    var turb_max = 0;
    var temp_max = 0;
    var tds_max = 0;
    var ph_max = 0;

    // console.log(d1, d2);
    // console.log(fr, tt);
    for (var i = 0; i < data1.length; i++) {
      var frtc = data1[i].date;
      var tfrtc = data[i].time;
      var frtcs = frtc.split("-");
      // tfrtc = convertTime(tfrtc)
      var tfrtcs = tfrtc.split(":");
      var x1 = frtcs[0];
      var y1 = frtcs[2];
      frtcs[0] = y1;
      frtcs[2] = x1;
      // console.log(tfrtc);
      var frmod = new Date(frtcs[0], frtcs[1], frtcs[2], tfrtcs[0], tfrtcs[1], "00", "00");
      if (frmod >= fr && frmod <= tt) {
        // console.log(fr,tt)
        hyd += parseFloat(data1[i].ph);
        temp += parseFloat(data1[i].temperature);
        solids += parseFloat(data1[i].tds);
        turb += parseFloat(data1[i].turbidity);

        turb_min = Math.min(turb_min, data1[i].turbidity)
        turb_max = Math.max(turb_max, data1[i].turbidity)

        temp_min = Math.min(temp_min, data1[i].temperature)
        temp_max = Math.max(temp_max, data1[i].temperature)
        
        ph_min = Math.min(ph_min, data1[i].ph)
        ph_max = Math.max(ph_max, data1[i].ph)

        tds_min = Math.min(tds_min, data1[i].tds)
        tds_max = Math.max(tds_max, data1[i].tds)

        pts++;
      }
    }
    setaverages({
      'turbidity': (Math.round(turb / pts * 100) / 100),
      'temperature': (Math.round(temp / pts * 100) / 100),
      'tds': (Math.round(solids / pts * 100) / 100),
      'ph': (Math.round(hyd / pts * 100) / 100)
    })
    setminimums({
      'turbidity': turb_min,
      'temperature': temp_min,
      'tds': tds_min,
      'ph': ph_min
    })
    setmaximums({
      'turbidity': turb_max,
      'temperature': temp_max,
      'tds': tds_max,
      'ph': ph_max
    })
  };
  const hrchange = () => {
    if (ch == 'yo') {
      setchr("yep");
    }
  };

  const o1 = () => {
    setch("g1")
  };
  const o2 = () => {
    setch("g2")
  };
  const o3 = () => {
    setch("g3")
  };
  const o4 = () => {
    setch("g4")
  };
  const handleChange1 = (event) => {
    var monthfield = event.target.value.split('-')[1];
    var dayfield = event.target.value.split('-')[2];
    var yearfield = event.target.value.split('-')[0];
    var inputDate = yearfield + monthfield - 1 + dayfield;
    var p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0;
    // console.log(event.target.value);
    setfrom(event.target.value);
    // setfrom1(inputDate);
    // console.log(event.target.value);

  };
  const handleChange2 = (event) => {
    var monthfield = event.target.value.split('-')[1];
    var dayfield = event.target.value.split('-')[2];
    var yearfield = event.target.value.split('-')[0];
    var inputDate = yearfield + monthfield - 1 + dayfield;
    // console.log(event.target.value);
    setto(event.target.value).then(console.log("done"));

  };

  const handleChange3 = (event) => {
    fromTimeSet(event.target.value)
    // console.log(fromTime);
    console.log(event.target.value)

  };
  const handleChange4 = (event) => {
    toTimeSet(event.target.value)
    // console.log(toTime);
    console.log(event.target.value)
  };
  
  const filtr = (dateCheck, timeCheck) => {
    var d1 = to.split("-");
    var d2 = from.split("-");
    var ftime = fromTime;
    // ftime = convertTime(ftime);
    var ttime = toTime;
    // ttime = convertTime(ttime);
    ftime = ftime.split(":");
    ttime = ttime.split(":");
    var c = dateCheck.split("-");
    if(timeCheck){
      var d = timeCheck
      d = d.split(":");
    }
    // var frtc = data1[i].date;
    //   var tfrtc = data[i].time;
    //   var frtcs = frtc.split("-");
    //   tfrtc = convertTime(tfrtc)
    //   var tfrtcs = tfrtc.split(":");
    //   var x1 = frtcs[0];
    //   var y1 = frtcs[2];
    //   frtcs[0] = y1;
    //   frtcs[2] = x1;
    //   // console.log(tfrtc);
    //   var frmod = new Date(frtcs[0], frtcs[1], frtcs[2], tfrtcs[0], tfrtcs[1], "00", "00");
    // console.log(ftime,ttime,d);
    var from1 = new Date(d1[0], parseInt(d1[1]) - 1, d1[2], ttime[0], ttime[1], "00");  // -1 because months are from 0 to 11
    var to2 = new Date(d2[0], parseInt(d2[1]) - 1, d2[2], ftime[0], ftime[1], "00");
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0], d[0], d[1], "00");
    hrchange();
    // console.log(from1, to2, check);
    return (check <= from1 && check >= to2);
  };

  const FilterGraphs = () => {
    setph_plot(data.map(i => { if (filtr(i.date,i.time) == true) { return { id: parseFloat(i.id), value: parseFloat(i.ph), time: moment(i.created).valueOf() } } }));
    settemperature_plot(data.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.temperature), time: moment(i.created).valueOf() } }));
    settds_plot(data.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.tds), time: moment(i.created).valueOf() } }));
    setturbidity_plot(data.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.turbidity), time: moment(i.created).valueOf() } }));
    getAverageValues1(data);
  }

  const setter = (data1) => {
    if (data1.length != undefined) {
      setph_plot(data1.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.ph), time: moment(i.created).valueOf() } }));
      settemperature_plot(data1.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.temperature), time: moment(i.created).valueOf() } }));
      settds_plot(data1.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.tds), time: moment(i.created).valueOf() } }));
      setturbidity_plot(data1.map(i => { if (filtr(i.date,i.time) == true) return { id: parseFloat(i.id), value: parseFloat(i.turbidity), time: moment(i.created).valueOf() } }));
      // console.log("hi");
    }
  };


  useEffect(() => {
    // console.log(data.length);
    axios
      .get("https://api.thingspeak.com/channels/1837482/feeds.json?results=1")
      .then((response) => {
        {
          var data1 = response.data.feeds[0];
          setrecent(data1);
        };
      })
    axios
      .get("https://team4eswbackend.herokuapp.com/user/data")
      .then((response) => {
        setdata(response.data);
        setter(response.data);
        getAverageValues1(response.data);
        // console.log(response.data.length)
      })
      .catch((error) => {
        console.log("lmoa ded")
      });

    setInterval(() => {
      axios
        .get("https://api.thingspeak.com/channels/1837482/feeds.json?results=1")
        .then((response) => {
          {
            var data1 = response.data.feeds[0];
            if (data1.field3 >= 8.6 || data1.field4 >= 30 || data1.field2 >= 60 || data1.field3 >= 40) {
              emailjs.send("service_e3x56gk", "template_hdvilrr", {
                message: "Accepted",
              }, "1YdU0xNphKJWO-1YW")
                .then((result) => {
                  console.log(result.text);
                }, (error) => {
                  console.log(error.text);
                });
            }
            setrecent(data1);
          };
        })
      axios
        .get("https://team4eswbackend.herokuapp.com/user/data")
        .then((response) => {
          // setdata(response.data);
          setter(response.data);
          getAverageValues1(response.data);
          // console.log(response.data.length)
        })
        .catch((error) => {
          // alert("Error while extracting");
          console.log("error while extracting")
        });
    }, 40000);

    // getAveragePh();

  }, []);

  return (
    <>
      {/* {console.log({ph_plot})} */}
      <div className="back">
        {/* <div className="back_img"><img src="./img.jpg"/>
      </div> */}
        <div className="up1">
          <div className="row top_cover">
            <div className="top_font"><div className="poot">WATER QUALITY MONITORING SYSTEM</div></div>
          </div>
          <div className="row cl">

            <div className="col 2 hup1"></div>
            <div className="col-2 hup"><div className="circle" onClick={() => o1()}><div className="tpr">{(Math.round(recent.field3 * 100) / 100)}</div><div className="tpr1">PH</div></div></div>
            <div className="col-2 hup"><div className="circle" onClick={() => o2()}><div className="tpr"><div>{(Math.round(recent.field2 * 100) / 100)}</div><div className="tpr1">Tubidity</div></div></div></div>
            <div className="col-2 hup"><div className="circle" onClick={() => o3()}><div className="tpr"><div>{(Math.round(recent.field4 * 100) / 100)}</div><div className="tpr1">Temperature</div></div></div></div>
            <div className="col-2 hup"><div className="circle" onClick={() => o4()}><div className="tpr"><div>{(Math.round(recent.field1 * 100) / 100)}</div><div className="tpr1">T.D.S</div></div></div></div>
            {/* <div className="col-2 hup"><div className="circle"><div className="tpr"><div>{averages['temperature']}</div><div className="tpr1">Average pH</div></div></div></div> */}
            <div className="col-2 hup1"></div>
          </div>
          <br /><br />

          {checker === "g1" && <div className="put">
            <LineChart width={1530} height={550} data={ph_plot}
              margin={{ top: 5, left: 400, bottom: 5 }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="time"
                // tickFormatter={timeStr => moment(timeStr).format('HH:mm')} 
                domain={['auto', 'auto']}
                tickFormatter={(date) => moment(date + " " + time).format('DD/MM/YY HH:mm:ss')}
                type='number'
                scale='time'
                tick={false}
                stroke="white"
              />

              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Line name='ph vs Time' type="monotone" dataKey="value" stroke={'#ff0000'} strokeWidth="1" />
            </LineChart>
            <div className="row">
                <div className="bros">
                  Average Ph:  {averages["ph"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Max Ph:  {maximums["ph"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Min Ph:  {minimums["ph"]}
                </div>
            </div>
            <br/>
          </div>}
          {checker == "g2" && <div className="put">
            <LineChart width={1530} height={550} data={turbidity_plot}
              margin={{ top: 5, left: 400, bottom: 5 }}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="time"
                domain={['auto', 'auto']}
                tickFormatter={(date) => moment(date).format('DD/MM/YY HH:mm')}
                type='number'
                scale='time'
                stroke="white"
                tick={false}
              />
              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Line name='turbidity vs Time' type="monotone" dataKey="value" stroke={'#ff0000'} strokeWidth="2" />
            </LineChart>
            <div className="row">
                <div className="bros">
                  Average turbidity:  {averages["turbidity"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Max turbidity:  {maximums["turbidity"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Min turbidity:  {minimums["turbidity"]}
                </div>
            </div>
            <br/>
          </div>}
          {checker == "g3" && <div className="put">
            <LineChart width={1530} height={550} data={temperature_plot}
              margin={{ top: 5, left: 400, bottom: 5 }}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="time"
                // tickFormatter={timeStr => moment(timeStr).format('HH:mm')} 
                domain={['auto', 'auto']}
                tickFormatter={(date) => moment(date).format('DD/MM/YY HH:mm')}
                type='number'
                scale='time'
                stroke="white"
                tick={false}
              />

              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Line name='Temperature vs Time' type="monotone" dataKey="value" stroke={'#ff0000'} strokeWidth="2" />
            </LineChart>
            <div className="row">
                <div className="bros">
                  Average Temperature:  {averages["temperature"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Max Temperature:  {maximums["temperature"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Min Temperature:  {minimums["temperature"]}
                </div>
            </div>
            <br/>
          </div>}
          {checker === "g4" && <div className="put">
            <LineChart width={1530} height={550} data={tds_plot}
              margin={{ top: 5, left: 400, bottom: 5 }}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="time"
                // tickFormatter={timeStr => moment(timeStr).format('HH:mm')}
                svg={{
                  color: "#ffff"
                }}
                domain={['auto', 'auto']}
                tickFormatter={(date) => moment(date).format('DD/MM/YY HH:mm')}
                type='number'
                scale='time'
                stroke="white"
                tick={false}
              />

              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Line name='TDS vs Time' type="monotone" dataKey="value" stroke={'#ff0000'} strokeWidth="2" />
            </LineChart>
            <div className="row">
                <div className="bros">
                  Average tds:  {averages["tds"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Max tds:  {maximums["tds"]}
                </div>
            </div>
            <div className="row">
                <div className="bros">
                  Min tds:  {minimums["tds"]}
                </div>
            </div>
            <br/>
          </div>}
          <br /><br /><br />
          <div className='row h_d_box'>
            <div className='col-3 h_date_box'>
              <Stack>
                <TextField
                  label="FROM"
                  type="date"
                  value={from}
                  onChange={handleChange1}
                  InputLabelProps={{
                    shrink: true,
                  }}

                />
              </Stack>
            </div>
            <div className='col-3 h_date_box'>
              <Stack>
                <TextField
                  label="TO"
                  type="date"
                  value={to}
                  onChange={handleChange2}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </div>
            <div className='col-3 h_download_button2'>
              <div className='h_run_button_text' onClick={() => FilterGraphs()}><div>Filter<FaCloudDownloadAlt /></div></div>
            </div>
          </div>
          <br/>
          <div className='row h_d_box'>
            <div className='col-3 h_date_box'>
              <Stack>
                <TextField
                  label="FROM"
                  type="time"
                  value={fromTime}
                  onChange={handleChange3}
                  InputLabelProps={{
                    shrink: true,
                  }}

                />
              </Stack>
            </div>
            <div className='col-3 h_date_box'>
              <Stack>
                <TextField
                  label="TO"
                  type="time"
                  value={toTime}
                  onChange={handleChange4}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </div>
          </div>
          { ch==="yo" && 
            <div className="marginer">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 540 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 90 }} align="center">Date</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Time</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">PH</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Temperature</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Turbidity</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">TDS</TableCell>
                    </TableRow>
                  </TableHead>
                  {data.length !== undefined &&

                    <TableBody>
                      {[...data].reverse().map((row) => (
                        <>
                          {true &&

                            <TableRow>
                              {/* {(from <= row.date1) && (to >= row.date1) && */}
                              <>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.date}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.time}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.ph}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.temperature}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.turbidity}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.tds}</TableCell>
                              </>
                              {/* }  */}
                            </TableRow>

                          }
                        </>

                      ))}
                    </TableBody>

                  }
                </Table>
              </TableContainer>
            </div>
          }
          {ch!=="yo" && 
            <div className="marginer">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 540 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 90 }} align="center">Date</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Time</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">PH</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Temperature</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">Turbidity</TableCell>
                      <TableCell sx={{ minWidth: 90 }} align="center">TDS</TableCell>
                    </TableRow>
                  </TableHead>
                  {data.length !== undefined &&

                    <TableBody>
                      {[...data].reverse().map((row) => (
                        <>
                          {filtr(row.date, row.time) === true &&

                            <TableRow>
                              {/* {(from <= row.date1) && (to >= row.date1) && */}
                              <>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.date}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.time}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.ph}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.temperature}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.turbidity}</TableCell>
                                <TableCell sx={{ minWidth: 90 }} align="center">{row.tds}</TableCell>
                              </>
                              {/* }  */}
                            </TableRow>

                          }
                        </>

                      ))}
                    </TableBody>

                  }
                </Table>
              </TableContainer>
            </div>
          }
          <br /><br /><br />
        </div>
      </div>
    </>
  );
};

export default Home;
