import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeSearchText,
  filterContacts,
  getContactById,
  getCharacterCount,
  getResponsiveViewName,
} from '../src/js/app.js';

test('normalizeSearchText normaliza mayúsculas y acentos', () => {
  assert.equal(normalizeSearchText('  FranK  '), 'frank');
  assert.equal(normalizeSearchText('Áéíóú'), 'aeiou');
  assert.equal(normalizeSearchText('Camila Rojas'), 'camila rojas');
  assert.equal(normalizeSearchText(null), '');
  assert.equal(normalizeSearchText(undefined), '');
});

test('filterContacts filtra por nombre o departamento', () => {
  const contacts = [
    { name: 'Camila Rojas', department: 'Diseño' },
    { name: 'Diego Muñoz', department: 'Operaciones' },
  ];

  // Name match
  const matchName = filterContacts(contacts, 'camila');
  assert.equal(matchName.length, 1);
  assert.equal(matchName[0].name, 'Camila Rojas');

  // Dept match
  const matchDept = filterContacts(contacts, 'operaciones');
  assert.equal(matchDept.length, 1);
  assert.equal(matchDept[0].name, 'Diego Muñoz');

  // Case insensitive match
  const matchCase = filterContacts(contacts, 'DIEGO');
  assert.equal(matchCase.length, 1);

  // Accent match
  const matchAccent = filterContacts(contacts, 'muñoz');
  assert.equal(matchAccent.length, 1);

  // Empty match
  const matchEmpty = filterContacts(contacts, 'tecnologia');
  assert.equal(matchEmpty.length, 0);

  // Null/Empty query
  const matchAll = filterContacts(contacts, '');
  assert.equal(matchAll.length, 2);
});

test('getContactById busca el contacto correcto', () => {
  const contacts = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
  ];

  assert.equal(getContactById(contacts, '1').name, 'A');
  assert.equal(getContactById(contacts, 2).name, 'B'); // Type coercion testing
  assert.equal(getContactById(contacts, '3'), null);
  assert.equal(getContactById(null, '1'), null);
});

test('getCharacterCount valida longitud y contenido vacío', () => {
  const t1 = getCharacterCount('Hola', 10);
  assert.equal(t1.count, 4);
  assert.equal(t1.max, 10);
  assert.equal(t1.isOver, false);
  assert.equal(t1.isValid, true);

  const t2 = getCharacterCount('Hola Mundo', 5);
  assert.equal(t2.count, 10);
  assert.equal(t2.isOver, true);
  assert.equal(t2.isValid, false);

  const t3 = getCharacterCount(null, 10);
  assert.equal(t3.count, 0);
  assert.equal(t3.isOver, false);
  assert.equal(t3.isValid, false); // empty string invalid

  const t4 = getCharacterCount('   ', 10); // only spaces
  assert.equal(t4.count, 3);
  assert.equal(t4.isOver, false);
  assert.equal(t4.isValid, false); // should be invalid if only spaces
});

test('getResponsiveViewName retorna el modo correcto en los límites', () => {
  assert.equal(getResponsiveViewName(767), 'mobile');
  assert.equal(getResponsiveViewName(768), 'tablet');
  assert.equal(getResponsiveViewName(1199), 'tablet');
  assert.equal(getResponsiveViewName(1200), 'desktop');
  assert.equal(getResponsiveViewName(1440), 'desktop');
});
