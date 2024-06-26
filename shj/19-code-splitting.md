# 19장. 코드 스플리팅
*2024/5/8 19장 정리*
* * *
Redux DOCS <br>
https://legacy.reactjs.org/docs/code-splitting.html

### intro
리액트 프로젝트를 완성해서 사용자에게 제공할 때 빌드 작업을 거쳐서 배포되어야 한다.<br>
즉, 웹팩이라는 도구를 통해 자바스크립트 파일 안에서 불필요한 주석, 메세지, 공백 등을 제거하여 크기를 최소화하고,<br>
버전에 맞춰 원활히 실행되도록 트랜스파이 작업도 할 수 있다.
<br><br>
**CRA**로 빌드할 경우, 최소 2개 이상의 자바스크립트 파일이 생성된다. <br>
기본 웹팩 설정에는 **SplitChunks**라는 기능이 적용되어 node_modules에서 불러온 파일, 일정 크기 이상의 파일, 여러 파일 간에 공유된 파일을 자동으로 따로 분리시켜서 캐싱의 효과를 누리게 한다.
![img](./img/19-img-1.png)

### 파일을 분리하는 작업, 코드 스플리팅
예시로, 프로젝트 페이지가 A,B,C로 구성되어있다고 가정한다면.<br>
별도의 리액트 설정을 하지 않으면 위 3가지 페이지가 모두 한 파일에 저장된다.<br>
그럼 파일 크기도 커지고, 로딩도 오래 걸려서 사용자 경험도 안 좋고, 트래픽도 많이 발생하게된다.<br>

**위 같은 문제를 해결해줄 수 있는 방법이 바로 코드 비동기 로딩이다.**<br>
코드 비동기 로딩을 통해 자바스크립트 함수, 객체, 혹은 컴포넌트를 처음에는 불러오지 않고,
필요한 시점에 불러와서 사용할 수 있다.

## 1. 자바스크립트 함수 비동기 로딩

바닐라 자바스크립트 함수를 스플리팅 해보자.
(notify.js, app.js 참고)
import를 상단에서 하고 불러오면 notify.js가 main파일 안에 들어가게 된다.<br>
import를 상단에서 하지 않고 import()메서드 안에 사용하면 파일이 분리되어 저장된다.

2. import 함수를 사용하면 Promise를 반환하는데, 이를 확인하기 위해 개발자도구 Network 확인 후 Hello React를 클릭.
<br> yarn build 해보면 3으로 시작하는 notify 관련 코드가 들어가게 된다.

## React.lazy와 Suspense를 통한 컴포넌트 코드 스플리팅
코드 스플리팅을 위해 리액트에 내장된 기능으로, 유틸 함수인 **React.lazy**와 컴포넌트인 **Suspense**가 있다.
<br>(react 16.6 버전부터 도입됨으로, 이전 버전에는 import 함수를 불러온 다음, 컴포넌트 자체를 state에 넣는 방식으로 구현해야함)

#### React.lazy를 사용하지 않았을 때
아래 코드에 경우, 매번 state를 선언해 주어야 한다는 점이 불편하다.
```js 
import React from 'react';
import logo from './logo.svg';
import './App.css';



class App extends Component {
  state = {
    SplitMe : null
  }
  handleClick = async () => {
    const loadedModule = await import('./SplitMe');
    this.setState({
      SplitMe: loadedModule.default
    })
  }
  render() {
    const {SplitMe} = this.state
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo'/>
          <p onClick={this.handleClick}>Hello React!</p>
          {SplitMe && <SplitMe/>}
        </header>
      </div>
    )
  }
}

export default App;

```

React.lazy와 Suspense를 사용하면 코드 스플리팅을 하기 위해 state를 따로 선언하지 않아도 된다.
#### React.lazy는 컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해주는 유틸함수이다.
#### Suspense는 리액트 내장 컴포넌트로서 코드 스플리팅된 컴포넌트를 로딩하도록 발동시킬 수 있고, 로딩이 끝나지 않았을 때 보여 줄 UI를 설정할 수 있다.
> Suspense에서 fallback props를 통해 로딩 중에 보여 줄 JSX를 지정할 수 있다.

```jsimport React, { useState, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
const SplitMe = React.lazy(() => import('./SplitMe'));

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </header>
    </div>
  );
}

export default App;
```


(로딩 문구가 나타남.)

### Loadable Components를 통한 코드 스플리팅
* Loadable Components는 코드 스플리팅을 편하게 하도록 도와주는 서드파티 라이브러리이다.
* 서버 사이드 렌더링을 지원함(React.lazy,Suspense는 SSR을 지원안한다고 하는데,,한다는 말도 있고...)
* 렌더링하기 전에 필요할 때 스플리팅된 파일을 미리 불러올 수 있다.

> **서버 사이드 렌더링이란?** 웹 서비스의 초기 로딩 속도 개선, 캐싱 및 검색 엔진 최적화를 가능하게 해 주는 기술이다.
<br> 서버 사이드 렌더링을 사용하면 웹 서비스의 초기 렌더링을 사용자의 브라우저가 아닌 서버 쪽에서 처리한다.

```js
import React, { useState, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import loadable from '@loadable/component';
const SplitMe = loadable(() => import('./SplitMe'));

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}

export default App;
```
이렇게 수정하면 마우스 커서를 Hello React! 위에 올리기만 해도 로딩이 시작되고, 클릭했을 때 렌더링된다.


https://www.smooth-code.com/open-source/loadable-components/docs/delay/
https://f-lab.kr/insight/react-rendering-optimization
https://legacy.reactjs.org/docs/code-splitting.html#reactlazy



서버 사이드 렌더링을 할 계획이 없다면 React.lazy와 Suspense로 구현하고, 계획이 있다면 Loadable Components를 사용해야 합니다. 리액트 공식 문서에서도 서버 사이드 렌더링을 할 경우 Loadable Components 라이브러리를 사용하도록 권장하고 있다.

