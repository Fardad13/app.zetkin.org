import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  remoteItemLoad,
  remoteItemDeleted,
  remoteItemUpdate,
  remoteItemUpdated,
  remoteList,
  RemoteList,
} from 'utils/storeUtils';
import { ZetkinJoinForm, ZetkinJoinSubmission } from './types';

export interface JoinFormsStoreSlice {
  formList: RemoteList<ZetkinJoinForm>;
  recentlyCreatedJoinForm: ZetkinJoinForm | null;
  submissionList: RemoteList<ZetkinJoinSubmission>;
}

const initialState: JoinFormsStoreSlice = {
  formList: remoteList(),
  recentlyCreatedJoinForm: null,
  submissionList: remoteList(),
};

const joinFormsSlice = createSlice({
  initialState: initialState,
  name: 'joinForms',
  reducers: {
    joinFormCreate: (state) => {
      state.formList.isLoading = true;
      state.recentlyCreatedJoinForm = null;
    },
    joinFormCreated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      state.recentlyCreatedJoinForm = form;
      remoteItemUpdated(state.formList, form);
    },
    joinFormDeleted: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      const item = state.formList.items.find((item) => item.id == formId);
      if (item) {
        item.deleted = true;
      }
    },
    joinFormLoad: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      remoteItemLoad(state.formList, formId);
    },
    joinFormLoaded: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      remoteItemUpdated(state.formList, form);
    },
    joinFormUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [formId, mutating] = action.payload;
      remoteItemUpdate(state.formList, formId, mutating);
    },
    joinFormUpdated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      remoteItemUpdated(state.formList, form);
    },
    joinFormsLoad: (state) => {
      state.formList.isLoading = true;
    },
    joinFormsLoaded: (state, action: PayloadAction<ZetkinJoinForm[]>) => {
      state.formList = remoteList(action.payload);
      state.formList.loaded = new Date().toISOString();
    },
    submissionDeleted: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      remoteItemDeleted(state.submissionList, submissionId);
    },
    submissionLoad: (state, action: PayloadAction<number>) => {
      const submissionId = action.payload;
      remoteItemLoad(state.submissionList, submissionId);
    },
    submissionLoaded: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      remoteItemUpdated(state.submissionList, submission);
    },
    submissionUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [submissionId, mutating] = action.payload;
      remoteItemUpdate(state.submissionList, submissionId, mutating);
    },
    submissionUpdated: (state, action: PayloadAction<ZetkinJoinSubmission>) => {
      const submission = action.payload;
      remoteItemUpdated(state.submissionList, submission);
    },
    submissionsLoad: (state) => {
      state.submissionList.isLoading = true;
    },
    submissionsLoaded: (
      state,
      action: PayloadAction<ZetkinJoinSubmission[]>
    ) => {
      state.submissionList = remoteList(action.payload);
      state.submissionList.loaded = new Date().toISOString();
    },
  },
});

export default joinFormsSlice;
export const {
  joinFormCreate,
  joinFormCreated,
  joinFormDeleted,
  joinFormLoad,
  joinFormLoaded,
  joinFormUpdate,
  joinFormUpdated,
  joinFormsLoad,
  joinFormsLoaded,
  submissionDeleted,
  submissionLoad,
  submissionLoaded,
  submissionUpdate,
  submissionUpdated,
  submissionsLoad,
  submissionsLoaded,
} = joinFormsSlice.actions;
