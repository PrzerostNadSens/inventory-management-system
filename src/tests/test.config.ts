import chai, { expect } from 'chai';

import app from '../app';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import sinon from 'sinon';

chai.use(chaiHttp);

dotenv.config();

export { chai, expect, app, sinon };
