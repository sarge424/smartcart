from fastapi import FastAPI, Request, Response, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from typing import Annotated
from datetime import datetime
import starlette.status as status


app = FastAPI()
templates = Jinja2Templates(directory='htmls')

sessions = {}

carts = {}

#LOGIN PAGE
@app.get('/')
async def login_page(request: Request):
    return templates.TemplateResponse('login.html', {'request': request})


#LOGIN TO CART
@app.post('/')
async def check_cartid(cartno: Annotated[str, Form()]):
    if cartno in sessions.keys():
        return RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    
    #init empty cart and send session cookie
    carts[cartno] = ['a', 'b', 'c']
    sessions[cartno] = str(hash(cartno + '50792bn-3hn' + datetime.now().strftime('%H%M%S')))
    response = RedirectResponse(f'/cart/{cartno}', status_code=status.HTTP_302_FOUND)
    response.set_cookie(key="session", value = sessions[cartno])
    return response


#CART PAGE
@app.get('/cart/{cartno}')
async def show_cart(request: Request, response: Response, cartno: str):
    #session mismatch - send to homepage
    if 'session' not in request.cookies.keys() or cartno not in sessions.keys() or sessions[cartno] != request.cookies['session']:
        response.delete_cookie('session')
        return RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    
    #TODO: DUMMY PAGE
    return templates.TemplateResponse('cart.html', {
        'request': request,
        'cartno': cartno,
        'items': carts[cartno]
    })
    
#LOGOUT
@app.get('/logout')
async def logout(request: Request):
    global sessions, carts
    
    #clear the session and cart corresponding to this cartno
    response = RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    for k in sessions.keys():
        if sessions[k] == request.cookies['session']:
            print('cleared session', k, sessions[k], carts[k])
            del carts[k]
            del sessions[k]
            break
        
    response.delete_cookie('session')
    return response
    