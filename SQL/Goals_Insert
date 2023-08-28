-- =============================================
-- Author: JaQuan Flood
-- Create date: 30 JUN 2023 
-- Description: INSERT into dbo.Goals
-- Code Reviewer: Chris Govero

-- MODIFIED BY:  JaQuan Flood
-- MODIFIED DATE: 30 JUN 2023 
-- Code Reviewer: Chris Govero
-- Note: 
-- =============================================

ALTER PROC [dbo].[Goals_Insert]
			@Name  nvarchar(75)
			,@Description nvarchar(125) = null
			,@GoalTypeId int
			,@TargetDate datetime2(7)
			,@UserId int
			,@Id INT OUTPUT

AS
BEGIN

INSERT INTO [dbo].[Goals]
           ([Name]
           ,[Description]
           ,[GoalTypeId]
		       ,[TargetDate]
           ,[CreatedBy]
           ,[ModifiedBy])
     VALUES
           (@Name
           ,@Description
           ,@GoalTypeId
		       ,@TargetDate
           ,@UserId
           ,@UserId)

		   SET @Id = SCOPE_IDENTITY()
END
