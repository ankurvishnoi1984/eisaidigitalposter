import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASEURL } from "../../constant/constant";
import domtoimage from "dom-to-image";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import "./PosterContent.css";
import axios from "axios";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
//import { toast } from "react-toastify";

const PosterContent = () => {

  const empId = sessionStorage.getItem("userId");
  const catId = sessionStorage.getItem("catId");
  const subCatId = sessionStorage.getItem("subCatId")
  const [singalDocData, setSinglDocData] = useState({});

  let { id } = useParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetDoctorById();
   
  }, []);

 

 

  async function GetDoctorById() {
    try {
      let response = await fetch(`${BASEURL}/getdoctor/${id}`);
      let data = await response.json();
      setSinglDocData(data[0]);
    } catch (error) {
      console.log(error);
    }
  }
 

 
  

  const profileImageUrl = singalDocData.imgurl || "";
 

  /// get from heare
  const handleSave1 = async () => {
    const toastId = toast.loading("Processing your download...");
    const poster = document.getElementById("pdiv1");
    const posterClone = poster.cloneNode(true);
    const profileImageClone = posterClone.querySelector(".profile-poster1");
    const profilenameClone = posterClone.querySelector(".namediv1");
    const profileTherapyClone = posterClone.querySelector(".therapydiv1");
    const profileHospitalClone = posterClone.querySelector(".hospitaldiv1");
  
    // Modify the clone
    profileImageClone.style.width = "585px"; 
    profileImageClone.style.height = "585px"; 
    profileImageClone.style.position = "absolute";
    profileImageClone.style.top = "28.6%";
    profileImageClone.style.left = "5.5%";
    profileImageClone.style.borderRadius = "50%";
  
    const maxLength = 16;
    const nameText = profilenameClone.textContent;
    if (nameText.length > maxLength) {
      profilenameClone.style.top = "35%";
      profilenameClone.style.lineHeight  = "1.3";
    } else {
      profilenameClone.style.top = "35%";
    }
  
    profilenameClone.style.position = "absolute";
    profilenameClone.style.left = "51%";
    profilenameClone.style.fontSize = "55px";
    profilenameClone.style.fontFamily = "Montserrat, sans-serif";
    profilenameClone.style.textAlign = 'center';
    profilenameClone.style.width = "700px";
    profilenameClone.style.color = '#fff';
    profilenameClone.style.fontWeight = "700";
    profilenameClone.style.wordBreak = "break-word";
    // profilenameClone.style.border = '1px solid blue'
  
    profileTherapyClone.style.position = "absolute";
    profileTherapyClone.style.top = "44%";
    profileTherapyClone.style.left = "50%";
    profileTherapyClone.style.fontSize = "45px";
    profileTherapyClone.style.fontFamily = "Montserrat, sans-serif";
    profileTherapyClone.style.textAlign = 'center';
    profileTherapyClone.style.width = "700px";
    profileTherapyClone.style.color = '#fff';
    profileTherapyClone.style.fontWeight = "700";
  
    profileHospitalClone.style.position = "absolute";
    profileHospitalClone.style.top = "48%";
    profileHospitalClone.style.left = "50%";
    profileHospitalClone.style.fontSize = "45px";
    profileHospitalClone.style.fontFamily = "Montserrat, sans-serif";
    profileHospitalClone.style.textAlign = "center";
    profileHospitalClone.style.width = "700px";
    profileHospitalClone.style.color = '#fff';
    profileHospitalClone.style.fontWeight = "700";
  
    // Load the profile image
    const profileImageSrc = profileImageClone.src;
    const profileImage = new Image();
    profileImage.src = profileImageSrc;
    profileImage.crossOrigin = "anonymous";
  
    profileImage.onload = async () => {
      // Create a temporary <img> element with the background image as its source
      const bgImg = new Image();
      bgImg.src = `/images/doctor2.jpg`;
  
      // Wait for the background image to load before generating the image
      bgImg.onload = async () => {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the background image onto the canvas
        ctx.drawImage(bgImg, 0, 0);
  
        // Draw the profile image onto the canvas
       // ctx.drawImage(profileImage, parseFloat(profileImageClone.style.left), parseFloat(profileImageClone.style.top), parseFloat(profileImageClone.style.width), parseFloat(profileImageClone.style.height));
        const x = parseFloat(85);
        const y = parseFloat(575);
        const width = parseFloat(profileImageClone.style.width);
        const height = parseFloat(profileImageClone.style.height);
        const radius = width / 2;
  
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
  
        ctx.drawImage(profileImage, x, y, width, height);
        ctx.restore();
        // Draw the poster content on top of the background image
        const dataUrl = await domtoimage.toPng(posterClone, {
          width: 1545,
          height: 2000,
        });
  
        // Get the Image data from the poster content
        const img = new Image();
        img.src = dataUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw the poster content on top of the background image
          ctx.drawImage(img, 0, 0);
  
          const randomName = `Doctor_Day_Poster_${Math.random().toString(36).substring(7)}.png`;
          // Convert the canvas to a data URL and create a download link
          const imageWithBackground = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imageWithBackground;
          link.download = randomName;
          link.click();
          toast.success("Download complete!", { id: toastId });
          canvas.remove();
        };
      };
    };
  };
 const handleSave2 = async () => {
    const toastId = toast.loading("Processing your download...");
    const poster = document.getElementById("pdiv2");
    const posterClone = poster.cloneNode(true);
    const profileImageClone = posterClone.querySelector(".profile-poster2");
    const profilenameClone = posterClone.querySelector(".namediv2");
    const profileTherapyClone = posterClone.querySelector(".therapydiv2");
    const profileHospitalClone = posterClone.querySelector(".hospitaldiv2");
    // console.log(profileTherapyClone.innerHTML)
  
    // Modify the clone
    profileImageClone.style.width = "1015px"; 
    profileImageClone.style.height = "1015px"; 
    profileImageClone.style.position = "absolute";
    profileImageClone.style.top = "39.55%";
    profileImageClone.style.left = "8%";
    profileImageClone.style.borderRadius = "50%";
  
    // const maxLength = 16;
    // const nameText = profilenameClone.textContent;
    // if (nameText.length > maxLength) {
    //   profilenameClone.style.top = "35%";
    //   profilenameClone.style.lineHeight  = "1.3";
    // } else {
    //   profilenameClone.style.top = "35%";
    // }
  
    profilenameClone.style.position = "absolute";
    profilenameClone.style.top = "38%";
    profilenameClone.style.left = "48%";
    profilenameClone.style.fontSize = "120px";
    profilenameClone.style.fontFamily = "Archivo Black, sans-serif";
    profilenameClone.style.textAlign = 'start';
    // profilenameClone.style.width = "1200px";
    profilenameClone.style.color = '#1900BB';
    profilenameClone.style.fontWeight = "900";
    profilenameClone.style.textShadow = `
  2px 0 #1900BB,
  -2px 0 #1900BB,
  0 2px #1900BB,
  0 -2px #1900BB,
  1.5px 1.5px #1900BB,
  -1.5px 1.5px #1900BB,
  1.5px -1.5px #1900BB,
  -1.5px -1.5px #1900BB
`;

    profilenameClone.style.wordBreak = "break-word";
    // profilenameClone.style.border = '1px solid blue'
  
    profileTherapyClone.style.position = "absolute";
    profileTherapyClone.style.top = "48.5%";
    profileTherapyClone.style.left = "48%";
    profileTherapyClone.style.fontSize = "120px";
    profileTherapyClone.style.fontFamily = "Balthazar, serif";
    profileTherapyClone.style.textAlign = 'start';
    // profileTherapyClone.style.width = "700px";
    profileTherapyClone.style.color = '#1900BB';
    profileTherapyClone.style.fontWeight = "500";
    profileTherapyClone.style.textShadow = `
  2px 0 #1900BB,
  -2px 0 #1900BB,
  0 2px #1900BB,
  0 -2px #1900BB,
  1.5px 1.5px #1900BB,
  -1.5px 1.5px #1900BB,
  1.5px -1.5px #1900BB,
  -1.5px -1.5px #1900BB
`;


  
    profileHospitalClone.style.position = "absolute";
    profileHospitalClone.style.top = "57%";
    profileHospitalClone.style.left = "48%";
    profileHospitalClone.style.fontSize = "120px";
    profileHospitalClone.style.fontFamily = "Balthazar, serif";
    profileHospitalClone.style.textAlign = "start";
    profileHospitalClone.style.width = "1200px";
    profileHospitalClone.style.color = '#1900BB';
    profileHospitalClone.style.fontWeight = "500";
    profileHospitalClone.style.textShadow = `
  2px 0 #1900BB,
  -2px 0 #1900BB,
  0 2px #1900BB,
  0 -2px #1900BB,
  1.5px 1.5px #1900BB,
  -1.5px 1.5px #1900BB,
  1.5px -1.5px #1900BB,
  -1.5px -1.5px #1900BB
`;
  
    // Load the profile image
    const profileImageSrc = profileImageClone.src;
    const profileImage = new Image();
    profileImage.src = profileImageSrc;
    profileImage.crossOrigin = "anonymous";
  
    profileImage.onload = async () => {
      // Create a temporary <img> element with the background image as its source
      const bgImg = new Image();
      bgImg.src = `/images/doctor3.jpg`;
  
      // Wait for the background image to load before generating the image
      bgImg.onload = async () => {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the background image onto the canvas
        ctx.drawImage(bgImg, 0, 0);
  
        // Draw the profile image onto the canvas
       // ctx.drawImage(profileImage, parseFloat(profileImageClone.style.left), parseFloat(profileImageClone.style.top), parseFloat(profileImageClone.style.width), parseFloat(profileImageClone.style.height));
        const x = parseFloat(275);
        const y = parseFloat(1920);
        const width = parseFloat(profileImageClone.style.width);
        const height = parseFloat(profileImageClone.style.height);
        const radius = width / 2;
  
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
  
        ctx.drawImage(profileImage, x, y, width, height);
        ctx.restore();
        // Draw the poster content on top of the background image
        const dataUrl = await domtoimage.toPng(posterClone, {
          width: 3375,
          height: 4844,
        });
  
        // Get the Image data from the poster content
        const img = new Image();
        img.src = dataUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw the poster content on top of the background image
          ctx.drawImage(img, 0, 0);
  
          const randomName = `Independence_Day_Poster_${Math.random().toString(36).substring(7)}.png`;
          // Convert the canvas to a data URL and create a download link
          const imageWithBackground = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imageWithBackground;
          link.download = randomName;
          link.click();
          toast.success("Download complete!", { id: toastId });
          canvas.remove();
        };
      };
    };
  };
 
  const handleSave3 = async () => {
    const toastId = toast.loading("Processing your download...");
    const poster = document.getElementById("pdiv3");
    const posterClone = poster.cloneNode(true);
    const profileImageClone = posterClone.querySelector(".profile-poster3");
    const profilenameClone = posterClone.querySelector(".namediv3");
    const profileTherapyClone = posterClone.querySelector(".therapydiv3");
    const profileHospitalClone = posterClone.querySelector(".hospitaldiv3");
    // console.log(profileTherapyClone.innerHTML)
  
    // Modify the clone
    profileImageClone.style.width = "700px"; 
    profileImageClone.style.height = "700px"; 
    profileImageClone.style.position = "absolute";
    profileImageClone.style.top = "4.1%";
    profileImageClone.style.left = "5.4%";
    profileImageClone.style.borderRadius = "50%";
  
    // const maxLength = 16;
    // const nameText = profilenameClone.textContent;
    // if (nameText.length > maxLength) {
    //   profilenameClone.style.top = "35%";
    //   profilenameClone.style.lineHeight  = "1.3";
    // } else {
    //   profilenameClone.style.top = "35%";
    // }
  
    profilenameClone.style.position = "absolute";
    profilenameClone.style.top = "8.5%";
    profilenameClone.style.left = "37.5%";
    profilenameClone.style.fontSize = "60px";
    profilenameClone.style.fontFamily = "Archivo Black, sans-serif";
    profilenameClone.style.textAlign = 'start';
    // profilenameClone.style.width = "1200px";
    profilenameClone.style.color = '#8e2d32';
    profilenameClone.style.fontWeight = "900";
//     profilenameClone.style.textShadow = `
//   2px 0 #1900BB,
//   -2px 0 #1900BB,
//   0 2px #1900BB,
//   0 -2px #1900BB,
//   1.5px 1.5px #1900BB,
//   -1.5px 1.5px #1900BB,
//   1.5px -1.5px #1900BB,
//   -1.5px -1.5px #1900BB
// `;

    profilenameClone.style.wordBreak = "break-word";
    // profilenameClone.style.border = '1px solid blue'
  
    profileTherapyClone.style.position = "absolute";
    profileTherapyClone.style.top = "13%";
    profileTherapyClone.style.left = "37.5%";
    profileTherapyClone.style.fontSize = "60px";
    profileTherapyClone.style.fontFamily = "Archivo Black, sans-serif";
    profileTherapyClone.style.textAlign = 'start';
    // profileTherapyClone.style.width = "700px";
    profileTherapyClone.style.color = '#8e2d32';
    profileTherapyClone.style.fontWeight = "500";
//     profileTherapyClone.style.textShadow = `
//   2px 0 #1900BB,
//   -2px 0 #1900BB,
//   0 2px #1900BB,
//   0 -2px #1900BB,
//   1.5px 1.5px #1900BB,
//   -1.5px 1.5px #1900BB,
//   1.5px -1.5px #1900BB,
//   -1.5px -1.5px #1900BB
// `;


  
    profileHospitalClone.style.position = "absolute";
    profileHospitalClone.style.top = "18%";
    profileHospitalClone.style.left = "37.5%";
    profileHospitalClone.style.fontSize = "60px";
    profileHospitalClone.style.fontFamily = "Archivo Black, sans-serif";
    profileHospitalClone.style.textAlign = "start";
    profileHospitalClone.style.width = "1200px";
    profileHospitalClone.style.color = '#8e2d32';
    profileHospitalClone.style.fontWeight = "500";
//     profileHospitalClone.style.textShadow = `
//   2px 0 #1900BB,
//   -2px 0 #1900BB,
//   0 2px #1900BB,
//   0 -2px #1900BB,
//   1.5px 1.5px #1900BB,
//   -1.5px 1.5px #1900BB,
//   1.5px -1.5px #1900BB,
//   -1.5px -1.5px #1900BB
// `;
  
    // Load the profile image
    const profileImageSrc = profileImageClone.src;
    const profileImage = new Image();
    profileImage.src = profileImageSrc;
    profileImage.crossOrigin = "anonymous";
  
    profileImage.onload = async () => {
      // Create a temporary <img> element with the background image as its source
      const bgImg = new Image();
      bgImg.src = `/images/alzposter.jpg`;
  
      // Wait for the background image to load before generating the image
      bgImg.onload = async () => {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;
        const ctx = canvas.getContext("2d");
  
        // Draw the background image onto the canvas
        ctx.drawImage(bgImg, 0, 0);
  
        // Draw the profile image onto the canvas
       // ctx.drawImage(profileImage, parseFloat(profileImageClone.style.left), parseFloat(profileImageClone.style.top), parseFloat(profileImageClone.style.width), parseFloat(profileImageClone.style.height));
        const x = parseFloat(135);
        const y = parseFloat(145);
        const width = parseFloat(profileImageClone.style.width);
        const height = parseFloat(profileImageClone.style.height);
        const radius = width / 2;
  
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
  
        ctx.drawImage(profileImage, x, y, width, height);
        ctx.restore();
        // Draw the poster content on top of the background image
        const dataUrl = await domtoimage.toPng(posterClone, {
          width: 2480,
          height: 3505,
        });
  
        // Get the Image data from the poster content
        const img = new Image();
        img.src = dataUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Draw the poster content on top of the background image
          ctx.drawImage(img, 0, 0);
  
          const randomName = `Alzheimer_Day_Poster_${Math.random().toString(36).substring(7)}.png`;
          // Convert the canvas to a data URL and create a download link
          const imageWithBackground = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imageWithBackground;
          link.download = randomName;
          link.click();
          toast.success("Download complete!", { id: toastId });
          canvas.remove();
        };
      };
    };
  };

  
  


console.log("singalDocData",singalDocData);
  return (
    <div>
      <div
        className="content-header"
        style={{ backgroundColor: "#39a6cf", color: "#fff", height:"50px" }}
      >
        <p className="text-center" style={{ fontSize: "25px" }}>
          {" "}
          <Link to="/dashboard" className=" text-left">
            <button type="button" className="btn btn-primary float-left">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>{" "}
        
        </p>

        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

  

      <section className="content mt-5">
        <div className="container-fluid">
          <div className="row">
         {subCatId == 1 ? 
         <div className="card bg-light ml-3">
         <div
           className="card-body pt-0 poster-image1"
           id="pdiv1"
           style={{
             backgroundImage: `url(/images/doctor2.jpg)`,
             fontFamily: 'Montserrat, sans-serif'
            
           }}
         >
           <div className="row">
             <div className=" text-center">
               <div className="profile-image1">
                 <img
                   src={`${BASEURL}/uploads/${profileImageUrl}`}
                   alt="doctor image"
                   className="profile-poster1"
                  // crossOrigin="anonymous"
                 />
               </div>
               <div className={`namediv1 montserrat-fnt ${singalDocData && singalDocData.name && singalDocData.name.length > 16 ? 'long-text' : ''}`}>
                 {singalDocData.name}
               </div>
               <div className="therapydiv1 montserrat-fnt">
                          {singalDocData.therapy}
                </div>
                <div className="hospitaldiv1 montserrat-fnt">
                          {singalDocData.hospital}
                </div>
             </div>
           </div>
         </div>
         <div className="card-footer">
           <div className="text-center">
             <div
               onClick={() =>
                 handleSave1()
               }
               className="btn btn-sm btn-danger"
             >
               <i className="fas fa-download"></i> Image
             </div>
           </div>
         </div>
         </div> :""
             }
               {subCatId == 2 ? 
         <div className="card bg-light ml-3">
         <div
           className="card-body pt-0 poster-image3"
           id="pdiv3"
           style={{
             backgroundImage: `url(/images/alzposter.jpg)`,
             fontFamily: 'Montserrat, sans-serif'
            
           }}
         >
           <div className="row">
             <div className=" text-center">
               <div className="profile-image3">
                 <img
                   src={`${BASEURL}/uploads/${profileImageUrl}`}
                   alt="doctor image"
                   className="profile-poster3"
                  // crossOrigin="anonymous"
                 />
               </div>
               <div className={`namediv3 montserrat-fnt ${singalDocData && singalDocData.name && singalDocData.name.length > 16 ? '' : ''}`}>
                 {singalDocData.name}
               </div>
               <div className="therapydiv3 montserrat-fnt">
                          {singalDocData.therapy}
                </div>
                <div className="hospitaldiv3 montserrat-fnt">
                          {singalDocData.hospital}
                </div>
             </div>
           </div>
         </div>
         <div className="card-footer">
           <div className="text-center">
             <div
               onClick={() =>
                 handleSave3()
               }
               className="btn btn-sm btn-danger"
             >
               <i className="fas fa-download"></i> Image
             </div>
           </div>
         </div>
         </div> :""
             }
         {subCatId == 6 ? 
         <div className="card bg-light ml-3">
         <div
           className="card-body pt-0 poster-image2"
           id="pdiv2"
           style={{
             backgroundImage: `url(/images/doctor3.jpg)`,
             fontFamily: 'Montserrat, sans-serif'
            
           }}
         >
           <div className="row">
             <div className=" text-center">
               <div className="profile-image2">
                 <img
                   src={`${BASEURL}/uploads/${profileImageUrl}`}
                   alt="doctor image"
                   className="profile-poster2"
                  // crossOrigin="anonymous"
                 />
               </div>
               <div className={`namediv2 montserrat-fnt ${singalDocData && singalDocData.name && singalDocData.name.length > 16 ? '' : ''}`}>
                 {singalDocData.name}
               </div>
               <div className="therapydiv2 montserrat-fnt">
                          {singalDocData.therapy}
                </div>
                <div className="hospitaldiv2 montserrat-fnt">
                          {singalDocData.hospital}
                </div>
             </div>
           </div>
         </div>
         <div className="card-footer">
           <div className="text-center">
             <div
               onClick={() =>
                 handleSave2()
               }
               className="btn btn-sm btn-danger"
             >
               <i className="fas fa-download"></i> Image
             </div>
           </div>
         </div>
         </div> :""
             }
          </div>
        </div>
      </section>
    </div>
  );
};

export default PosterContent;
