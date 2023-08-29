  public class GoalAddRequest
    {
        [Required]
        [StringLength(75, MinimumLength =1)]
        public string Name { get; set; }


        [StringLength(125, MinimumLength = 25)]
        public string Description { get; set; }

        [Required]
        [Range(1,int.MaxValue)]
        public int?  GoalTypeId { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime TargetDate { get; set; }
       
        
    }
