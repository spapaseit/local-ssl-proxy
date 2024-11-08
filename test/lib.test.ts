import { test, expect } from 'vitest';
import { isProxy, isConfig, parse, ParsedArguments, Proxy, Config } from '../src/lib';


function expectProxy(result: ParsedArguments): Proxy { 
  if (isProxy(result)) { 
    return result; 
  } 
  
  throw new Error('Returned object is not of type Proxy');
}

function expectConfig(result: ParsedArguments): Config { 
  if (isConfig(result)) { 
    return result; 
  } 
  
  throw new Error('Returned object is not of type Proxy');
}

test('cert (default)', () => {
  const result = parse([]); 
  const { cert } = expectProxy(result); 
  expect(cert).toEqual(expect.any(String));
  expect(result.bindAddress).toBeUndefined();
});

test('cert', () => {
  const result = parse(['--cert', require.resolve('../resources/localhost.pem')]);
  const { cert } = expectProxy(result); 
  expect(cert).toEqual(expect.any(String));
});

test('key (default)', () => {
  const result = parse([]);
  const { key } = expectProxy(result);
  expect(key).toEqual(expect.any(String));
});

test('key', () => {
  const result = parse(['--key', require.resolve('../resources/localhost-key.pem')]);
  const { key } = expectProxy(result);
  expect(key).toEqual(expect.any(String));
});

test('hostname (default)', () => {
  const result = parse([]);
  const { hostname } = expectProxy(result);
  expect(hostname).toBe('localhost');
});

test('hostname', () => {
  const result = parse(['--hostname', '127.0.0.1']);
  const { hostname } = expectProxy(result);
  expect(hostname).toBe('127.0.0.1');
});

test('source (default)', () => {
  const result = parse([]);
  const { source } = expectProxy(result);
  expect(source).toBe(9001);
});

test('source', () => {
  const result = parse(['--source', '5001']);
  const { source } = expectProxy(result);
  expect(source).toBe(5001);
});

test('target (default)', () => {
  const result = parse([]);
  const { target } = expectProxy(result);
  expect(target).toBe(9000);
});

test('target', () => {
  const result = parse(['--target', '5000']);
  const { target } = expectProxy(result);
  expect(target).toBe(5000);
});

test('bindAddress', () => {
  const { bindAddress } = parse(['--bindAddress', '0.0.0.0']);
  expect(bindAddress).toBe('0.0.0.0');
});

test('config', () => {
  const result = parse(['--config', require.resolve('./test-config.json'),'--bindAddress', '0.0.0.0']);
  expect(result.bindAddress).toBe('0.0.0.0');

  const parsed = expectConfig(result);
  expect(parsed.config).toMatchInlineSnapshot(`
{
  "Proxy 1": {
    "cert": "/etc/apache2/server.pem",
    "hostname": "localhost",
    "key": "/etc/apache2/server.key",
    "source": 443,
    "target": 1867,
  },
  "Proxy 2": {
    "cert": "/etc/apache2/server.pem",
    "hostname": "localhost",
    "key": "/etc/apache2/server.key",
    "source": 5001,
    "target": 3001,
  },
}
`);
});
