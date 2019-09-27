import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(username, password);
    let r = await fetch(`/api/login?username=${username}&password=${password}`);
    console.dir(r);
    if (r.status === 200) {
      let ret = await r.json();
      console.dir(ret);
      router.push({
        pathname: "/my/info",
        query: ret
      });
    } else {
      console.log(r.status);
    }
  };

  const withOnchange = setState => e => setState(e.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:{" "}
        <input
          type="text"
          name="username"
          value={username}
          onChange={withOnchange(setUsername)}
        />
      </label>
      <label>
        Password:{" "}
        <input
          type="password"
          name="password"
          value={password}
          onChange={withOnchange(setPassword)}
        />
      </label>
      <input type="submit" />
    </form>
  );
};

export default Login;
