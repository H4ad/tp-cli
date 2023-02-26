import { expect } from '@oclif/test';
import { describe } from 'mocha';
import { WILDCARDS } from '../../src/utils/wildcards';

describe('Wildcards', () => {
  it('$NAME$', () => {
    const fn = WILDCARDS.$NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestTwo')).equal('TestTwo');
    expect(fn('test')).equal('test');
    expect(fn('test-two')).equal('test-two');
  });

  it('$PASCAL_SINGULAR_NAME', () => {
    const fn = WILDCARDS.$PASCAL_SINGULAR_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('TestTwo');
    expect(fn('TestsTwos')).equal('TestTwo');
    expect(fn('tests')).equal('Test');
    expect(fn('tests-two')).equal('TestTwo');
    expect(fn('tests-twos')).equal('TestTwo');
  });

  it('$PARAM_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$PARAM_SINGULAR_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('test-two');
    expect(fn('TestsTwos')).equal('test-two');
    expect(fn('tests')).equal('test');
    expect(fn('tests-two')).equal('test-two');
    expect(fn('tests-twos')).equal('test-two');
  });

  it('$CAMEL_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$CAMEL_SINGULAR_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('testTwo');
    expect(fn('TestsTwos')).equal('testTwo');
    expect(fn('tests')).equal('test');
    expect(fn('tests-two')).equal('testTwo');
    expect(fn('tests-twos')).equal('testTwo');
  });

  it('$CAPITAL_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$CAPITAL_SINGULAR_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('Test Two');
    expect(fn('TestsTwos')).equal('Test Two');
    expect(fn('tests')).equal('Test');
    expect(fn('tests-two')).equal('Test Two');
    expect(fn('tests-twos')).equal('Test Two');
  });

  it('$CONSTANT_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$CONSTANT_SINGULAR_NAME$;

    expect(fn('Test')).equal('TEST');
    expect(fn('TestsTwo')).equal('TEST_TWO');
    expect(fn('TestsTwos')).equal('TEST_TWO');
    expect(fn('tests')).equal('TEST');
    expect(fn('tests-two')).equal('TEST_TWO');
    expect(fn('tests-twos')).equal('TEST_TWO');
  });

  it('$HEADER_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$HEADER_SINGULAR_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('Test-Two');
    expect(fn('TestsTwos')).equal('Test-Two');
    expect(fn('tests')).equal('Test');
    expect(fn('tests-two')).equal('Test-Two');
    expect(fn('tests-twos')).equal('Test-Two');
  });

  it('$DOT_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$DOT_SINGULAR_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('test.two');
    expect(fn('TestsTwos')).equal('test.two');
    expect(fn('tests')).equal('test');
    expect(fn('tests-two')).equal('test.two');
    expect(fn('tests-twos')).equal('test.two');
  });

  it('$PATH_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$PATH_SINGULAR_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('test/two');
    expect(fn('TestsTwos')).equal('test/two');
    expect(fn('tests')).equal('test');
    expect(fn('tests-two')).equal('test/two');
    expect(fn('tests-twos')).equal('test/two');
  });

  it('$SNAKE_SINGULAR_NAME$', () => {
    const fn = WILDCARDS.$SNAKE_SINGULAR_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('test_two');
    expect(fn('TestsTwos')).equal('test_two');
    expect(fn('tests')).equal('test');
    expect(fn('tests-two')).equal('test_two');
    expect(fn('tests-twos')).equal('test_two');
  });

  it('$PASCAL_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$PASCAL_PLURAL_NAME$;

    expect(fn('Test')).equal('Tests');
    expect(fn('TestsTwo')).equal('TestsTwos');
    expect(fn('TestsTwos')).equal('TestsTwos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('TestsTwos');
    expect(fn('tests-twos')).equal('TestsTwos');
  });

  it('$PARAM_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$PARAM_PLURAL_NAME$;

    expect(fn('Test')).equal('tests');
    expect(fn('TestsTwo')).equal('tests-twos');
    expect(fn('TestsTwos')).equal('tests-twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests-twos');
    expect(fn('tests-twos')).equal('tests-twos');
  });

  it('$CAMEL_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$CAMEL_PLURAL_NAME$;

    expect(fn('Test')).equal('tests');
    expect(fn('TestsTwo')).equal('testsTwos');
    expect(fn('TestsTwos')).equal('testsTwos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('testsTwos');
    expect(fn('tests-twos')).equal('testsTwos');
  });

  it('$CAPITAL_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$CAPITAL_PLURAL_NAME$;

    expect(fn('Test')).equal('Tests');
    expect(fn('TestsTwo')).equal('Tests Twos');
    expect(fn('TestsTwos')).equal('Tests Twos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('Tests Twos');
    expect(fn('tests-twos')).equal('Tests Twos');
  });

  it('$CONSTANT_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$CONSTANT_PLURAL_NAME$;

    expect(fn('Test')).equal('TESTS');
    expect(fn('TestsTwo')).equal('TESTS_TWOS');
    expect(fn('TestsTwos')).equal('TESTS_TWOS');
    expect(fn('tests')).equal('TESTS');
    expect(fn('tests-two')).equal('TESTS_TWOS');
    expect(fn('tests-twos')).equal('TESTS_TWOS');
  });

  it('$HEADER_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$HEADER_PLURAL_NAME$;

    expect(fn('Test')).equal('Tests');
    expect(fn('TestsTwo')).equal('Tests-Twos');
    expect(fn('TestsTwos')).equal('Tests-Twos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('Tests-Twos');
    expect(fn('tests-twos')).equal('Tests-Twos');
  });

  it('$DOT_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$DOT_PLURAL_NAME$;

    expect(fn('Test')).equal('tests');
    expect(fn('TestsTwo')).equal('tests.twos');
    expect(fn('TestsTwos')).equal('tests.twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests.twos');
    expect(fn('tests-twos')).equal('tests.twos');
  });

  it('$PATH_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$PATH_PLURAL_NAME$;

    expect(fn('Test')).equal('tests');
    expect(fn('TestsTwo')).equal('tests/twos');
    expect(fn('TestsTwos')).equal('tests/twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests/twos');
    expect(fn('tests-twos')).equal('tests/twos');
  });

  it('$SNAKE_PLURAL_NAME$', () => {
    const fn = WILDCARDS.$SNAKE_PLURAL_NAME$;

    expect(fn('Test')).equal('tests');
    expect(fn('TestsTwo')).equal('tests_twos');
    expect(fn('TestsTwos')).equal('tests_twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests_twos');
    expect(fn('tests-twos')).equal('tests_twos');
  });

  it('$PASCAL_NAME$', () => {
    const fn = WILDCARDS.$PASCAL_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('TestsTwo');
    expect(fn('TestsTwos')).equal('TestsTwos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('TestsTwo');
    expect(fn('tests-twos')).equal('TestsTwos');
  });

  it('$PARAM_NAME$', () => {
    const fn = WILDCARDS.$PARAM_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('tests-two');
    expect(fn('TestsTwos')).equal('tests-twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests-two');
    expect(fn('tests-twos')).equal('tests-twos');
  });

  it('$CAMEL_NAME$', () => {
    const fn = WILDCARDS.$CAMEL_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('testsTwo');
    expect(fn('TestsTwos')).equal('testsTwos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('testsTwo');
    expect(fn('tests-twos')).equal('testsTwos');
  });

  it('$CAPITAL_NAME$', () => {
    const fn = WILDCARDS.$CAPITAL_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('Tests Two');
    expect(fn('TestsTwos')).equal('Tests Twos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('Tests Two');
    expect(fn('tests-twos')).equal('Tests Twos');
  });

  it('$CONSTANT_NAME$', () => {
    const fn = WILDCARDS.$CONSTANT_NAME$;

    expect(fn('Test')).equal('TEST');
    expect(fn('TestsTwo')).equal('TESTS_TWO');
    expect(fn('TestsTwos')).equal('TESTS_TWOS');
    expect(fn('tests')).equal('TESTS');
    expect(fn('tests-two')).equal('TESTS_TWO');
    expect(fn('tests-twos')).equal('TESTS_TWOS');
  });

  it('$HEADER_NAME$', () => {
    const fn = WILDCARDS.$HEADER_NAME$;

    expect(fn('Test')).equal('Test');
    expect(fn('TestsTwo')).equal('Tests-Two');
    expect(fn('TestsTwos')).equal('Tests-Twos');
    expect(fn('tests')).equal('Tests');
    expect(fn('tests-two')).equal('Tests-Two');
    expect(fn('tests-twos')).equal('Tests-Twos');
  });

  it('$DOT_NAME$', () => {
    const fn = WILDCARDS.$DOT_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('tests.two');
    expect(fn('TestsTwos')).equal('tests.twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests.two');
    expect(fn('tests-twos')).equal('tests.twos');
  });

  it('$PATH_NAME$', () => {
    const fn = WILDCARDS.$PATH_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('tests/two');
    expect(fn('TestsTwos')).equal('tests/twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests/two');
    expect(fn('tests-twos')).equal('tests/twos');
  });

  it('$SNAKE_NAME$', () => {
    const fn = WILDCARDS.$SNAKE_NAME$;

    expect(fn('Test')).equal('test');
    expect(fn('TestsTwo')).equal('tests_two');
    expect(fn('TestsTwos')).equal('tests_twos');
    expect(fn('tests')).equal('tests');
    expect(fn('tests-two')).equal('tests_two');
    expect(fn('tests-twos')).equal('tests_twos');
  });
});
