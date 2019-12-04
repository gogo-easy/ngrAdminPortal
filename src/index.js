import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter,Route } from 'react-router-dom';
// import 'normalize.css'
import Router from './router'


render(
    <BrowserRouter>
        <div>
            {
                Router.map((item,idx)=>{
                    return <Route path={item.path} exact component={item.page} key={idx}/>
                })
            }
         </div>
    </BrowserRouter>,
    document.getElementById('root')
);

