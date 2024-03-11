//###V6###
import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Profile from "./Profile";

const Profiles = () => {
  return (
    <div>
      <h3>사용자 목록:</h3>
      <ul>
        <li>
          <NavLink
            to="./ciy"
            style={({ isActive }) => ({ color: isActive ? "green" : "blue" })}
          >
            최인영
          </NavLink>
        </li>
        <li>
          <NavLink
            to="./kmr"
            style={({ isActive }) => ({ color: isActive ? "green" : "blue" })}
          >
            김미리
          </NavLink>
        </li>
        <li>
          <NavLink
            to="./ohr"
            style={({ isActive }) => ({ color: isActive ? "green" : "blue" })}
          >
            오혜림
          </NavLink>
        </li>
        <li>
          <NavLink
            to="./shj"
            style={({ isActive }) => ({ color: isActive ? "green" : "blue" })}
          >
            석현정
          </NavLink>
        </li>
        <li>
          <NavLink
            to="./sm2s"
            style={({ isActive }) => ({ color: isActive ? "green" : "blue" })}
          >
            서문명수
          </NavLink>
        </li>
      </ul>

      <Routes>
        <Route path="/*" element={<div>스터디 원을 선택해주세요.</div>} />
        <Route path=":username" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Profiles;

/*
V5와 V6, 그 차이점

V5에서는 <Profiles /> 컴포넌트를 렌더링한 뒤, 
Profiles 주소로 들어오면 render 안의 <div>를 렌더링하고, 
<Profiles /> 컴포넌트를 렌더링해 주었습니다.

V6에서 변동된 점은 다음과 같습니다.
- render => element, 화살표 함수 사용하지 않음.
- 하위 페이지가 있을 경우, 부모 Route에 /*을 추가해 주어야 합니다. 이는 exact의 역할을 대신합니다.
- path에서 부모 경로는 필요없으며, 파라미터만 작성해 줍니다. (:username)
- 앞서 언급했듯, <Route>들을 <Routes>로 싹 다 감싸줘야 합니다.
*/
