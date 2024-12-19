import { EventData, Page } from '@nativescript/core';
import { ExpensesViewModel } from './expenses-view-model';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new ExpensesViewModel();
}