import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import "./components.css";
import ProfileEdit from "./subComponents/profileEdit";
export default function EditProfile({match})
{

    const[name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[company,setCompany] = useState("");
    const[country,setCountry] = useState("");
    const[city,setCity] = useState("");
    const[address,setAddress] = useState("");
    const context = useContext(Context);
    const[profileNotedited,setProfileNotEdited] = useState(true);

     //to set the inputfields when editprofile button clicked
    let setInput = async()=>{
        let uservalue = context.users.filter((user)=>user.id===match.params.id);
        //if page refreshed this will fetch api and set input fileds
        if(uservalue.length===0)
        {
           const {data} = await axios.get(`https://jsonplaceholder.typicode.com/users/${match.params.id}`);
           uservalue.push(data);
        }
        uservalue.forEach((user)=>{
            setName(user.name);
            setEmail(user.email);
            setCompany(user.company);
            setCountry(user.country);
            setCity(user.city);
            setAddress(user.address);
        })
    }

      useEffect(()=>{
          setInput();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])
   
      //to update changes in api
      let putuser = async({name,email,company,country,city,address})=>{
          const {data} = await axios.put(`https://jsonplaceholder.typicode.com/users/${match.params.id}`,{
              name:name,
              email:email,
              company:company,
              country:country,
              city:city,
              address:address
          })
         
          let tempusers = [...context.users];
          let index = context.users.findIndex((user)=>user.id === match.params.id);
          tempusers[index] = data;
          context.setUsers(tempusers);//upadting values in context api
          setProfileNotEdited(false);
      }
      

    

     
    return(
        <>
          <div className="container">
          {profileNotedited ? 
          (<>    
        <h1 className="text-center text-info">Edit Profile {match.params.id}</h1>
        <ProfileEdit 
        name={name}
        email={email}
        company={company}
        country={country}
        city={city}
        address={address}
        putuser={putuser}
        />
        </>)
        :
        (
            <>
            <div className="confirmtext">
           <h1>Profile Edited</h1> 
           <i className="fas fa-check-circle"></i>
           </div>
           </>
        )
        }
        </div>
        </>
    );
}