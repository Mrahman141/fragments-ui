'use client'
import {Auth, getUser} from '../auth'
// Button is used from Shadcn/ui from https://ui.shadcn.com/docs/components/button
import { Button } from "../components/ui/button"
import React, { useState, useEffect } from 'react';
import Link from "next/link"


export default function Home() {

  const [username, setUsername] = useState('');
  const [LoggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    try {
      await Auth.federatedSignIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  }
  
  const handleLogout = async (e) => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        if (!user) {
          setLoggedIn(false)
        }
        else{
          console.log(user);
          setUsername(user.username);
          setLoggedIn(true)
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchUserData function
    fetchUserData();


  }, [LoggedIn]);

  return (
    <div>
      <h1 className="text-5xl text-center pt-10 text-white">Welcome to Fragments-ui</h1>

      {LoggedIn == true ? (
        <h1 className="text-3xl text-center pt-10 text-white">Hello, {username}</h1>
      ) : (
        <></>
      )}

      <div className="flex justify-center pt-7">

        {LoggedIn == false ? (
          <div className="pr-2">
            <Button variant="outline" onClick={handleLogin}>Login</Button>
          </div>
        ) : (
          <div className="pl-2">
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        )}

      </div>


    </div>
  );
}
