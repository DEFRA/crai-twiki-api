# Use ADP PostgreSql migration image as base image
FROM {{adpSharedAcrName}}.azurecr.io/image/adp-postgres-migration:1.0.0

# Copy migration changelog files
COPY --chown=liquibase:liquibase --chmod=755 changelog ./changelog

CMD ["-Command","update", "-ChangeLogFile","/changelog/db.changelog.xml"]