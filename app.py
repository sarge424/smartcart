from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates


app = FastAPI()
templates = Jinja2Templates(directory='htmls')
carts = []


@app.get('/carts')
def show_carts():
    return {'carts': carts}

@app.get('/login/{cart_id}')
def home(request: Request, cart_id: int):
        if cart_id in carts:
            return {'cart_id': cart_id, 'created': False}
        else:
            carts.append(cart_id)
            return {'cart_id': cart_id, 'created': True}
