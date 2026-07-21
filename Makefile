SHELL := /usr/bin/env bash

.PHONY: doctor context-check help

help:
	@printf '%s\n' \
		'make doctor        Verify Fairfield Polo project context and services' \
		'make context-check Alias for make doctor'

doctor:
	@./scripts/doctor.sh

context-check: doctor
