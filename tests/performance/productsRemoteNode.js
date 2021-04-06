import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');


export const options = {
  stages: [
  // { duration: '2m', target: 100 }, // below normal load
  // { duration: '2m', target: 200 }, // normal load
  // { duration: '2m', target: 300 }, // around the breaking point
  // { duration: '2m', target: 400 }, // beyond the breaking point
  { duration: '2m', target: 2500 },
  // { duration: '5m', target: 0 } // scale down. Recovery stage
  ],
};

export default function () {
  const BASE_URL = `http://54.151.9.108:3300`;
  let response;

  response = http.get(`${BASE_URL}/products`);

  const checkRes = check(response, {
    'status is 200': (r) => r.status === 200,
    'response body': (r) => r.body.indexOf('Camo Onesie') !== -1,
  });

  sleep(1);
}

// response = http.get(`${BASE_URL}/products/10000`);

// response = http.get(`${BASE_URL}/products/10000/styles`);