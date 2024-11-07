'use client';
import { Auth, getUser } from '../../auth';
import React, { useState, useEffect } from 'react';
import { getFragments } from '@/helpers/get_fragment';



export default function Home() {

    const fetchUserData = async () => {
        try {
          const user_data = await getUser();
    
          if (!user_data) {
            setLoggedIn(false);
          } else {
            // Do an authenticated request to the fragments API server and log the result
            const userFragments = await getFragments(user_data);
            console.log(userFragments)
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    
      useEffect(() => {
        fetchUserData();
      }, []);


    return (
        <div>
            List of all the fragment metadata
        </div>
    );
}
