'use client';
import { Auth, getUser } from '../auth';
// Button is used from Shadcn/ui from https://ui.shadcn.com/docs/components/button
import { Button } from '../components/ui/button';
import React, { useState, useEffect } from 'react';
import { getUserFragments } from '../api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Create from '../components/create_fragment/create';
import Show from '../components/show_fragment/show';

export default function Home() {
  const [username, setUsername] = useState('');
  const [LoggedIn, setLoggedIn] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [user, setUser] = useState();

  const handleLogin = async (e) => {
    try {
      await Auth.federatedSignIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleLogout = async (e) => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const user_data = await getUser();

      if (!user_data) {
        setLoggedIn(false);
      } else {
        // Do an authenticated request to the fragments API server and log the result
        const userFragments = await getUserFragments(user_data);

        setUsername(user_data.username);
        setLoggedIn(true);
        setUser(user_data);
      }
    } catch (error) {
      console.log(error.message);
    }
    setDataFetched(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!dataFetched) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#ffffff] mx-auto"></div>
            <h2 className="text-white mt-4">Loading...</h2>
            <p className="text-slate-400">
              Your data is being retrieved. Please wait. Thank you for your
              patience!
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-5xl text-center pt-10 text-white">
        Welcome to Fragments-ui
      </h1>

      {LoggedIn == true ? (
        <h1 className="text-3xl text-center pt-10 text-white">
          Hello, {username}
        </h1>
      ) : (
        <></>
      )}

      <div className="flex justify-center pt-7">
        <div className="flex flex-col items-center">
          {LoggedIn == false ? (
            <div className="mb-4">
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
              <h1 className="text-2xl text-center pt-10 text-white">
                Select what you&apos;d like to view about your Fragments
              </h1>
              <div>
                <Tabs defaultValue="account" className="pt-12">
                  <div className="flex justify-center">
                    <TabsList>
                      <TabsTrigger value="show">
                        See All Fragments
                      </TabsTrigger>
                      <TabsTrigger value="create">
                        Create a Fragment
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="show" className="text-white">
                    <Show/>
                  </TabsContent>
                  <TabsContent value="create" className="text-white pt-10">
                    {' '}
                    <Create user={user} />{' '}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
