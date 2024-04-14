from fastapi import FastAPI, Request, Response, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from typing import Annotated
from datetime import datetime
import starlette.status as status


app = FastAPI()
templates = Jinja2Templates(directory='htmls')

sessions = {}

@app.get('/')
async def login_page(request: Request):
    return templates.TemplateResponse('login.html', {'request': request})

@app.post('/')
async def check_cartid(cartno: Annotated[str, Form()]):
    if cartno in sessions.keys():
        return RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    
    sessions[cartno] = str(hash(cartno + '50792bn-3hn' + datetime.now().strftime('%H%M%S')))
    response = RedirectResponse(f'/cart/{cartno}', status_code=status.HTTP_302_FOUND)
    response.set_cookie(key="session", value = sessions[cartno])
    return response

@app.get('/cookie')
def show_cookies(request: Request):
    return {'cookies': request.cookies}

@app.get('/cart/{cartno}')
async def show_cart(request: Request, response: Response, cartno: str):
    if 'session' not in request.cookies.keys() or cartno not in sessions.keys() or sessions[cartno] != request.cookies['session']:
        response.delete_cookie('session')
        return RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    
    return templates.TemplateResponse('cart.html', {
        'request': request,
        'cartno': cartno,
        'session_id': request.cookies['session']
    })
    
@app.get('/logout')
async def logout(request: Request):
    global sessions
    response = RedirectResponse('/', status_code=status.HTTP_302_FOUND)
    if 'session' in request.cookies.keys():
        sessions = {k:v for k,v in sessions.items() if v != request.cookies['session']}
    response.delete_cookie('session')
    return response
    