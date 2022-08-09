import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Login from "../components/Login";
import EisenHower from "../components/EisenHower";
import { useState, useEffect } from "react";

const creator = "a80214a4-2868-4f11-aa34-bb6327c57b9c";
const project_name = "EisenHower";
const important = "72e05a5c-3e11-408d-a179-069aeeba7cce";
const urgent = "7d6594e9-61bb-4fcf-834c-934dcef76b77";

const Home: NextPage = () => {
  const [apiKey, setApiKey] = useState();
  const [user, setUser] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState({
    _do: [],
    deligate: [],
    _delete: [],
    schedule: [],
  });

  useEffect(() => {
    if (apiKey !== undefined) {
      generateMatrix();
      return;
    }
    let map = new Map();
    let cookie = document.cookie;
    cookie = cookie.replaceAll(";", "");
    let cookies = cookie.split(" ");
    cookies
      .map((cookie) => cookie.split("="))
      .forEach(([key, value]) => map.set(key, value));
    setApiKey(map.get("api"));
    setUser(map.get("user"));
    if (!isLoggedIn && map.get("api")) {
      setLoggedIn(true);
    }
  }, [isLoggedIn]);

  async function getData() {
    try {
      let res = await fetch("https://habitica.com/api/v3/tasks/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-api-user": user,
          "x-client": creator + "-" + project_name,
        },
      });
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  }

  async function generateMatrix() {
    let data = await getData();
    console.log(data);
    let [_do, schedule, deligate, _delete] = Array(4).fill([]);
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].completed) continue;
      if (
        data.data[i].tags.includes(important) &&
        data.data[i].tags.includes(urgent)
      ) {
        _do.push(data.data[i]);
        continue;
      }
      if (data.data[i].tags.includes(important)) schedule.push(data.data[i]);
      if (data.data[i].tags.includes(urgent)) deligate.push(data.data[i]);
      _delete.push(data.data[i]);
    }
    setData({ _do, schedule, deligate, _delete });
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isLoggedIn ? (
          <EisenHower grid_data={data}></EisenHower>
        ) : (
          <Login login={setLoggedIn}></Login>
        )}
      </main>
    </div>
  );
};

export default Home;
